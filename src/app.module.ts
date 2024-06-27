import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/entities/song.entity';
import { Artist } from './artists/entities/artist.entity';
import { User } from './users/entities/user.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { Playlist } from './playlists/entities/playlist.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';

// const devConfig = { port: 3000 };
// const proConfig = { port: 4000 };

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['.development.env', '.production.env'],
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ScheduleModule.forRoot(),
    SongsModule,
    PlaylistsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TaskService
    // {
    //   provide: 'CONFIG',
    //   useFactory: () => {
    //     return process.env.NODE_ENV === 'development' ? devConfig : proConfig;
    //   }
    // }
  ],
})

export class AppModule { }

// export class AppModule implements NestModule {
//   constructor(private dataSource: DataSource) {
//     console.log('DBName', dataSource.driver.database)
//   }
//   configure(consumer: MiddlewareConsumer) {
//     // consumer.apply(LoggerMiddleware).forRoutes('songs') // Option #1
//     // consumer.apply(LoggerMiddleware).forRoutes({ path: 'songs', method: RequestMethod.POST }) // Option #2
//     consumer.apply(LoggerMiddleware).forRoutes(SongsController) // Option #3
//   }
// }