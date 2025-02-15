import { Body, Controller, Delete, Param, Post, Put, Get, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { CreateHotelReqDto, CreateImageReqDto, DeleteHotelReqDto, FindHotelReqDto, UpdateHotelReqDto } from './dto/req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HotelService } from './hotel.service';
import { FindHotelResDto } from './dto/res.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';

@ApiTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Public()
  @Post()
  async create(@Body() createHotelReqDto: CreateHotelReqDto) {
    return this.hotelService.create(createHotelReqDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHotelReqDto: UpdateHotelReqDto) {
    return this.hotelService.update(id, updateHotelReqDto);
  }

  @Delete()
  async remove(@Param() { id }: DeleteHotelReqDto): Promise<boolean> {
    return this.hotelService.remove(id);
  }

  @Public()
  @Get()
  async findAll(@User() user: UserAfterAuth): Promise<FindHotelResDto[]> {
    return this.hotelService.findAll(user?.id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Public()
  @Post('upload/:id')
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'png' })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() { name }: CreateImageReqDto,
    @Param() { id }: FindHotelReqDto,
  ) {
    const { mimetype, path } = file;
    return this.hotelService.upload(id, name, mimetype, path);
  }
}
