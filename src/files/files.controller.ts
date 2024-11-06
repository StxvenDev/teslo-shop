import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './fileFilter.helper';
import { diskStorage } from 'multer';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    storage: diskStorage({
      destination : './static/uploads'
    })
  }))
  uploadProductFile( 
    @UploadedFile() file: Express.Multer.File,
  ){

    if(!file)
      throw new BadRequestException('Make sure this file is an image')

    return {
      filename : file.originalname
    }
  }
}
