import { Controller, Get } from '@nestjs/common';
import { CareersService } from './careers.service';

@Controller('careers')
export class CareersController {
  constructor(private readonly service: CareersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}