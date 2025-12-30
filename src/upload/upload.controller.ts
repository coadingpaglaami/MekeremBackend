import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service.js';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('single')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; url: string }> {
    const url = await this.uploadService.uploadSingleFile(file);
    return { message: 'File uploaded successfully', url };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ message: string; urls: string[] }> {
    const urls = await this.uploadService.uploadMultipleFiles(
      files,
      'multiple',
    );
    return { message: 'Files uploaded successfully', urls };
  }
}
