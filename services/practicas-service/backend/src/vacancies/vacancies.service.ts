import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import {
  Prisma,
  agreement_status,
  vacancy_status,
  request_status,
} from '@prisma/client';
import { paginate } from '../common/utils/paginate';
import { ListVacanciesDto } from './dto/list-vacancies.dto';

@Injectable()
export class VacanciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    companyProfileId: string,  // antes companyUserId
    agreementId: number,
    dto: CreateVacancyDto,
  ) {
    const company = await this.prisma.company.findUnique({
      where: { profile_id: companyProfileId },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada.');
    }

    const agreement = await this.prisma.agreement.findFirst({
      where: {
        id: agreementId,
        company_id: company.id,
        status: agreement_status.APPROVED,
      },
    });

    if (!agreement) {
      throw new ForbiddenException(
        'El convenio no existe, no pertenece a esta empresa o no está aprobado.',
      );
    }

    return this.prisma.vacancy.create({
      data: {
        agreement_id: agreementId,
        title: dto.title,
        specialty: dto.specialty,
        slots: dto.slots,
        status: vacancy_status.OPEN,
      },
    });
  }

  async findAll(query: ListVacanciesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.vacancyWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.agreementId) where.agreement_id = query.agreementId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.vacancy.findMany({
        where,
        include: {
          agreement: {
            include: {
              company: true,
            },
          },
        },
        orderBy: { id: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.vacancy.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findByAgreement(agreementId: number) {
    return this.prisma.vacancy.findMany({
      where: { agreement_id: agreementId },
      include: {
        agreement: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id },
      include: {
        agreement: {
          include: {
            company: true,
          },
        },
        request: true,
        prelocalization_assignment: true,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacante no encontrada.');
    }

    return vacancy;
  }

  async toggleStatus(id: number) {
    const vacancy = await this.findOne(id);

    const approvedRequestsCount = vacancy.request.filter(
      (r) => r.status === request_status.APPROVED,
    ).length;

    if (
      vacancy.status === vacancy_status.CLOSED &&
      approvedRequestsCount >= vacancy.slots
    ) {
      throw new ForbiddenException(
        'La vacante está llena y no puede reabrirse.',
      );
    }

    const newStatus =
      vacancy.status === vacancy_status.OPEN
        ? vacancy_status.CLOSED
        : vacancy_status.OPEN;

    return this.prisma.vacancy.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async findOpen() {
    return this.prisma.vacancy.findMany({
      where: { status: vacancy_status.OPEN },
      include: {
        agreement: {
          include: {
            company: true,
          },
        },
      },
    });
  }
}