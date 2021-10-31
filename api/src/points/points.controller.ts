import { Controller, Get, Post, Body, Put, Param,
  UseInterceptors, UploadedFile, HttpStatus, HttpCode, UseGuards, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Roles } from './../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { extname } from  'path';
import { diskStorage } from  'multer';


@Controller('points')
@UseGuards(RolesGuard)
export class PointsController {
  constructor(
    private readonly pointsService: PointsService
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPointDto: CreatePointDto) {
    return this.pointsService.create(createPointDto);
  }

  @Post('new_file')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
      console.log(randomName)
      console.log(extname(file.originalname))
      return cb(null, `${randomName}${extname(file.originalname)}`)
    }
    })
  }))
  async uploadFile(@UploadedFile() file) {
    return this.pointsService.newFile(file);
  }

  @Get()
  findAll() {
    return this.pointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'user')
  update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
    return this.pointsService.update(id, updatePointDto);
  }

  @Put('view/:id')
  @UseGuards(AuthGuard('jwt'))
  addView(@Param('id') id: string) {
    return this.pointsService.addView(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  deletePoint(@Param('id') id: string) {
    return this.pointsService.delete(id);
  }

  
}
