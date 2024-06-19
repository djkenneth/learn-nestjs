import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: 'postgres',
            database: 'spotify-clone-db',
            password: 'admin',
            entities: ["dist/**/*.entity.js"],
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