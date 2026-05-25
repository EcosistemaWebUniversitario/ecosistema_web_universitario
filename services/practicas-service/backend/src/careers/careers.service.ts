import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CareersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    console.log('🔍 CareersService.findAll llamado');
    try {
      const careers = await this.prisma.career.findMany({
        orderBy: { name: 'asc' },
      });
      console.log('✅ Careers result:', careers);
      return careers;
    } catch (error) {
      console.error('💥 ERROR en CareersService.findAll:', error);
      throw error;
    }
  }
}