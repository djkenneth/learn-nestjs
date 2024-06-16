import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './jwt.strategy';
import { ArtistsModule } from 'src/artists/artists.module';
import { ApiKeyStrategy } from './ApiKeyStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('secret'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ArtistsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, ApiKeyStrategy],
  exports: [AuthService]
})
export class AuthModule { }
