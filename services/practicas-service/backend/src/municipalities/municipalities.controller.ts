import { Controller, Get } from '@nestjs/common';
import { MunicipalitiesService } from './municipalities.service';

@Controller('municipalities')
export class MunicipalitiesController {
  constructor(private readonly service: MunicipalitiesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}