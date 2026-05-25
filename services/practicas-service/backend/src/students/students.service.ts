import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(profileId: string, dto: CreateStudentDto) {
    // Verificar unicidad por profile_id y por ci
    const existing = await this.prisma.student.findFirst({
      where: {
        OR: [
          { profile_id: profileId },
          { ci: dto.ci },
        ],
      },
    });

    if (existing) {
      if (existing.profile_id === profileId) {
        throw new ConflictException('El usuario ya tiene perfil de estudiante.');
      }
      if (existing.ci === dto.ci) {
        throw new ConflictException('El carnet de identidad ya está registrado.');
      }
    }

    return this.prisma.student.create({
      data: {
        names: dto.firstName,                   // mapeo desde el DTO
        surnames: dto.lastName,
        ci: dto.ci,
        academic_year: dto.academicYear,
        career_id: dto.careerId,
        municipality_id: dto.municipalityId,
        profile_id: profileId,
        study_mode: dto.studyMode ?? 'REGULAR_DIURNO',
      },
      include: {
        career: true,
        municipality: true,
      },
    });
  }

  async findMyProfile(profileId: string) {
    const student = await this.prisma.student.findUnique({
      where: { profile_id: profileId },
      include: {
        profiles: {
          select: {
            id: true,
            full_name: true,
            role_id: true,
          },
        },
        career: true,
        municipality: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    return student;
  }

  async updateMyProfile(profileId: string, dto: UpdateStudentProfileDto) {
    const student = await this.prisma.student.findUnique({
      where: { profile_id: profileId },
    });

    if (!student) {
      throw new NotFoundException('Perfil de estudiante no encontrado.');
    }

    // Actualizar full_name en profiles si se modificó algún nombre
    if (dto.firstName || dto.lastName) {
      const fullName = `${dto.firstName ?? student.names} ${dto.lastName ?? student.surnames}`.trim();
      await this.prisma.profiles.update({
        where: { id: profileId },
        data: { full_name: fullName },
      });
    }

    return this.prisma.student.update({
      where: { profile_id: profileId },
      data: {
        ...(dto.firstName && { names: dto.firstName }),
        ...(dto.lastName && { surnames: dto.lastName }),
      },
      include: {
        profiles: {
          select: {
            id: true,
            full_name: true,
            role_id: true,
          },
        },
        career: true,
        municipality: true,
      },
    });
  }

  async changePassword(profileId: string, dto: ChangePasswordDto) {
    throw new BadRequestException(
      'El cambio de contraseña debe realizarse a través del servicio de autenticación (auth-service).',
    );
  }
}