import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  agreement_type,
  request_status,
  vacancy_status,
  agreement_status,
} from '@prisma/client';
import { paginate } from '../common/utils/paginate';
import { ListRequestsDto } from './dto/list-requests.dto';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async apply(profileId: string, vacancyId: number) {
    const student = await this.prisma.student.findUnique({
      where: { profile_id: profileId },
    });

    if (!student) {
      throw new ForbiddenException(
        'Tu usuario no tiene perfil de estudiante.',
      );
    }

    if (student.academic_year !== 3) {
      throw new ForbiddenException(
        'Solo estudiantes de 3er año pueden aplicar a prácticas.',
      );
    }

    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id: vacancyId },
      include: {
        agreement: true,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacante no encontrada.');
    }

    if (vacancy.status !== vacancy_status.OPEN) {
      throw new ForbiddenException('Esta vacante no está disponible.');
    }

    if (!vacancy.agreement || vacancy.agreement.status !== agreement_status.APPROVED) {
      throw new ForbiddenException(
        'La vacante debe pertenecer a un convenio aprobado.',
      );
    }

    if (
      vacancy.agreement.type !== agreement_type.PRACTICE &&
      vacancy.agreement.type !== agreement_type.BOTH
    ) {
      throw new ForbiddenException(
        'Esta vacante no pertenece al proceso de prácticas.',
      );
    }

    const alreadyApplied = await this.prisma.request.findFirst({
      where: {
        student_id: student.id,
        vacancy_id: vacancyId,
      },
    });

    if (alreadyApplied) {
      throw new ConflictException('Ya aplicaste a esta vacante.');
    }

    return this.prisma.request.create({
      data: {
        student_id: student.id,
        vacancy_id: vacancyId,
        status: request_status.PENDING,
      },
    });
  }

  async findMy(profileId: string) {
    const student = await this.prisma.student.findUnique({
        where: { profile_id: profileId },
    });

    if (!student) {
      throw new ForbiddenException(
        'Tu usuario no tiene perfil de estudiante.',
      );
    }

    return this.prisma.request.findMany({
      where: {
        student_id: student.id,
      },
      include: {
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
      orderBy: { created_at: 'desc' },
    });
  }

  async findAll(query: ListRequestsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.requestWhereInput = {};

    if (query.status) where.status = query.status;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.request.findMany({
        where,
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
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.request.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async approve(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.request.findUnique({
        where: { id },
        include: {
          vacancy: true,
        },
      });

      if (!request) {
        throw new NotFoundException('Solicitud no encontrada.');
      }

      if (request.status !== request_status.PENDING) {
        throw new ForbiddenException(
          'Solo se pueden aprobar solicitudes pendientes.',
        );
      }

      const updated = await tx.request.update({
        where: { id },
        data: { status: request_status.APPROVED },
      });

      const approvedCount = await tx.request.count({
        where: {
          vacancy_id: request.vacancy_id,
          status: request_status.APPROVED,
        },
      });

      if (approvedCount >= request.vacancy.slots) {
        await tx.vacancy.update({
          where: { id: request.vacancy_id },
          data: { status: vacancy_status.CLOSED },
        });
      }

      return updated;
    });
  }

  async reject(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.request.findUnique({
        where: { id },
        include: {
          vacancy: true,
        },
      });

      if (!request) {
        throw new NotFoundException('Solicitud no encontrada.');
      }

      if (request.status !== request_status.PENDING) {
        throw new ForbiddenException(
          'Solo se pueden rechazar solicitudes pendientes.',
        );
      }

      const updated = await tx.request.update({
        where: { id },
        data: { status: request_status.REJECTED },
      });

      const approvedCount = await tx.request.count({
        where: {
          vacancy_id: request.vacancy_id,
          status: request_status.APPROVED,
        },
      });

      if (approvedCount < request.vacancy.slots) {
        await tx.vacancy.update({
          where: { id: request.vacancy_id },
          data: { status: vacancy_status.OPEN },
        });
      }

      return updated;
    });
  }
}