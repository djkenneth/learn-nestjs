import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcryptjs";
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './payload.type';
import { Enable2FAType } from './auth-types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private artistService: ArtistsService,
        private configService: ConfigService
    ) { }

    getEnvVariables() {
        return {
            port: this.configService.get<number>("port"),
        };
    }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string } | { validate2FA: string; message: string }> {
        const user = await this.userService.findOne(loginDTO); // 1.
        const passwordMatched = await bcrypt.compare(
            loginDTO.password,
            user.password
        ); // 2.
        if (passwordMatched) { // 3.
            delete user.password; // 4.

            // Sends JWT Token back in the response
            const payload: PayloadType = { email: user.email, userId: user.id };

            // find if it is an artist then the add the artist id to payload
            const artist = await this.artistService.findArtist(user.id); // 5
            if (artist) { // 6
                payload.artistId = artist.id;
            }

            // If user has enabled 2FA and have the secret key then
            if (user.enable2FA && user.twoFASecret) { // 7
                // sends the validateToken request link
                // else otherwise sends the json web token in the response
                return { // 8
                    validate2FA: 'http://localhost:3000/auth/validate-2fa',
                    message:
                        'Please send the one-time password/token from your Google Authenticator App',
                };
            }

            return {
                accessToken: this.jwtService.sign(payload),
            };
        } else {
            throw new UnauthorizedException("Password does not match"); // 9
        }
    }

    async enable2FA(userId: number): Promise<Enable2FAType> {
        const user = await this.userService.findById(userId); //1
        if (user.enable2FA) { //2
            return { secret: user.twoFASecret };
        }
        const secret = speakeasy.generateSecret(); //3
        console.log(secret);
        user.twoFASecret = secret.base32; //4
        await this.userService.updateSecretKey(user.id, user.twoFASecret); //5
        return { secret: user.twoFASecret }; //6
    }

    // validate the 2fa secret with provided token
    async validate2FAToken(
        userId: number,
        token: string,
    ): Promise<{ verified: boolean }> {
        try {
            // find the user on the based on id
            const user = await this.userService.findById(userId);
            // extract his 2FA secret
            // verify the secret with a token by calling the speakeasy verify method
            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                token: token,
                encoding: 'base32',
            });
            // if validated then sends the json web token in the response
            if (verified) {
                return { verified: true };
            } else {
                return { verified: false };
            }
        } catch (err) {
            throw new UnauthorizedException('Error verifying token');
        }
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userService.disable2FA(userId);
    }

    async validateUserByApiKey(apiKey: string): Promise<User> {
        return this.userService.findByApiKey(apiKey);
    }
}
