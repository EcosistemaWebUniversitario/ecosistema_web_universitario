// src/municipalities/municipalities.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MunicipalitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    console.log('🔍 MunicipalitiesService.findAll llamado');
    try {
      const municipalities = await this.prisma.municipality.findMany({
        orderBy: { name: 'asc' },
      });
      console.log('✅ Municipalities result:', municipalities);
      return municipalities;
    } catch (error) {
      console.error('💥 ERROR en MunicipalitiesService.findAll:', error);
      throw error;
    }
  }
}