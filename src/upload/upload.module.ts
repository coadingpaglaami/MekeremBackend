import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller.js';
import { CloudinaryProvider } from './cloudinary.provider.js';
import { UploadService } from './upload.service.js';


@Module({
  controllers: [UploadController],
  providers: [CloudinaryProvider, UploadService],
  exports: [UploadService],
})
export class UploadModule {}
