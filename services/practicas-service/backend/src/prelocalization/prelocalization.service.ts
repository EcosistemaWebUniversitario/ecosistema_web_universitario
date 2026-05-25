import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCallDto } from './dto/create-call.dto';
import { Prisma, call_status } from '@prisma/client';
import { paginate } from '../common/utils/paginate';
import { ListCallsDto } from './dto/list-calls.dto';

@Injectable()
export class PrelocalizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(profileId: string, dto: CreateCallDto) {
    const creator = await this.prisma.profiles.findUnique({
      where: { id: profileId },
    });

    if (!creator) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return this.prisma.prelocalization_call.create({
      data: {
        career_id: dto.careerId,
        academic_year: dto.academicYear,
        created_by: profileId,
        status: call_status.OPEN,
      },
      include: {
        career: true,
        profiles: {
          select: {
            id: true,
            full_name: true,
            role_id: true,
          },
        },
      },
    });
  }

  async findAll(query: ListCallsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.prelocalization_callWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.careerId) where.career_id = query.careerId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.prelocalization_call.findMany({
        where,
        include: {
          career: true,
          profiles: {
            select: {
              id: true,
              full_name: true,
              role_id: true,
            },
          },
          prelocalization_ranking: true,
          prelocalization_assignment: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.prelocalization_call.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findOne(id: number) {
    const call = await this.prisma.prelocalization_call.findUnique({
      where: { id },
      include: {
        career: true,
        profiles: {
          select: {
            id: true,
            full_name: true,
            role_id: true,
          },
        },
        prelocalization_ranking: {
          include: {
            student: {
              include: {
                career: true,
                municipality: true,
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
        prelocalization_assignment: {
          include: {
            student: {
              include: {
                career: true,
                municipality: true,
              },
            },
            vacancy: {
              include: {
                agreement: {
                  include: {
                    company: true,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    if (!call) {
      throw new NotFoundException('Convocatoria no encontrada.');
    }

    return call;
  }

  async close(id: number) {
    const call = await this.prisma.prelocalization_call.findUnique({
      where: { id },
    });

    if (!call) {
      throw new NotFoundException('Convocatoria no encontrada.');
    }

    if (call.status === call_status.CLOSED) {
      throw new ForbiddenException('La convocatoria ya está cerrada.');
    }

    return this.prisma.prelocalization_call.update({
      where: { id },
      data: {
        status: call_status.CLOSED,
      },
    });
  }

  async results(id: number) {
    const call = await this.findOne(id);

    return {
      callId: call.id,
      career: call.career,
      academicYear: call.academic_year,
      status: call.status,
      assignments: call.prelocalization_assignment,
    };
  }

  async myResults(profileId: string) {
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
        prelocalization_assignment: {
          include: {
            prelocalization_call: true,
            vacancy: {
              include: {
                agreement: {
                  include: {
                    company: {
                      include: {
                        municipality: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Perfil de estudiante no encontrado.');
    }

    if (student.academic_year !== 4) {
      throw new ForbiddenException(
        'Este módulo solo está disponible para estudiantes de 4to año.',
      );
    }

    const assignment = student.prelocalization_assignment[0] ?? null;

    return {
      student,
      hasAssignment: !!assignment,
      assignment,
    };
  }
}