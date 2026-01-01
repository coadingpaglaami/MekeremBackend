import { Controller } from '@nestjs/common';
import { ServicesService } from './services.service.js';

@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
}
