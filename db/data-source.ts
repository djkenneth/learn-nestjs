import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import 'dotenv/config';
import { Artist } from "src/artists/entities/artist.entity";
import { Playlist } from "src/playlists/entities/playlist.entity";
import { Song } from "src/songs/entities/song.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: "postgres",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: "postgres",
            database: process.env.DB_NAME,
            password: process.env.PASSWORD,
            // host: configService.get<string>("dbHost"),
            // port: configService.get<number>("dbPort"),
            // username: configService.get<string>("username"),
            // database: configService.get<string>("dbName"),
            // password: configService.get<string>("password"),
            // entities: ["dist/**/*.entity.js"],
            entities: [User, Playlist, Artist, Song],
            synchronize: false,
            migrations: ["dist/db/migrations/*.js"],
        };
    }
};

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    entities: ["dist/**/*.entity.js"], //1
    synchronize: false, // 2
    migrations: ["dist/db/migrations/*.js"], // 3
};

const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;