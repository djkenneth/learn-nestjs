import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
// import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Artist } from 'src/artists/entities/artist.entity';

// const mockSongsService = {
//   findAll() {
//     return [{ id: 1, title: 'Lasting' }]
//   }
// }

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],
  providers: [
    SongsService,
    // {
    //   provide: SongsService,
    //   useValue: mockSongsService
    // }
    // {
    //   provide: 'CONNECTION',
    //   useValue: connection
    // }
  ],
})
export class SongsModule { }
