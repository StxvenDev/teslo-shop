import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper copy';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    storage: diskStorage({
      destination : './static/products',
      filename: fileNamer
    })
  }))
  uploadProductFile( 
    @UploadedFile() file: Express.Multer.File,
  ){

    if(!file)
      throw new BadRequestException('Make sure this file is an image')

    console.log(file);
    return {
      filename : file.originalname
    }
  }
}
