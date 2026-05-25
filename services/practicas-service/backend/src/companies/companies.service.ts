import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(profileId: string, dto: CreateCompanyDto) {
    const existing = await this.prisma.company.findUnique({
      where: { profile_id: profileId },
    });

    if (existing) {
      throw new ConflictException('El usuario ya tiene un perfil de empresa.');
    }

    return this.prisma.company.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        municipality_id: dto.municipalityId,
        profile_id: profileId,
      },
    });
  }

  async findMyProfile(profileId: string) {
    const company = await this.prisma.company.findUnique({
      where: { profile_id: profileId },
      include: {
        profiles: {
          select: { id: true, full_name: true, role_id: true },
        },
        municipality: true,
      },
    });

    if (!company) {
      throw new NotFoundException('No se encontró un perfil de empresa asociado a este usuario');
    }
    return company;
  }

  async updateMyProfile(profileId: string, dto: UpdateCompanyProfileDto) {
    const company = await this.prisma.company.findUnique({
      where: { profile_id: profileId },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (dto.name) {
      await this.prisma.profiles.update({
        where: { id: profileId },
        data: { full_name: dto.name },
      });
    }

    if (dto.email) {
      throw new BadRequestException(
        'El cambio de email debe realizarse a través del servicio de autenticación (Supabase).',
      );
    }

    return this.prisma.company.update({
      where: { id: company.id },
      data: {
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
      },
      include: {
        profiles: {
          select: {
            id: true,
            full_name: true,
            role_id: true,
          },
        },
        municipality: true,
      },
    });
  }
}