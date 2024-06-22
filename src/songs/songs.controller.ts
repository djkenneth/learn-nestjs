import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpCode, HttpStatus, ParseIntPipe, Inject, Query, DefaultValuePipe, UseGuards, Request } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
// import { Connection } from 'src/common/constants/connection';
import { Song } from './entities/song.entity';
import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/jwt-artist.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('songs')
@ApiTags("songs")
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    // @Inject('CONNECTION')
    // private connection: Connection
  ) {
    // console.log(`THIS IS CONNECTION SSTRING ${this.connection.CONNECTION_STRING}`);
  }

  @Post()
  @UseGuards(JwtArtistGuard) // 1
  create(@Body() createSongDto: CreateSongDto, @Request() req): Promise<Song> {
    try {
      console.log(req.user);
      return this.songsService.create(createSongDto);
    } catch (error) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR, { cause: error })
    }
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDto): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songsService.remove(id);
  }
}
