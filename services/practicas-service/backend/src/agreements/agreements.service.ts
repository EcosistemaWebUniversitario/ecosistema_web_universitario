import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { paginate } from '../common/utils/paginate';
import { ListAgreementsDto } from './dto/list-agreements.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AgreementsService {
  constructor(private prisma: PrismaService) {}

  async create(profileId: string, dto: CreateAgreementDto) {
    const company = await this.prisma.company.findUnique({
      where: { profile_id: profileId },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return this.prisma.agreement.create({
      data: {
        company_id: company.id,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        specialty: dto.specialty,
        students_needed: dto.studentsNeeded,
        bank_problem_document: dto.bankProblemDocument ?? null,
        status: 'PENDING',
        approved_by_practices: false,
        approved_by_prelocation: false,
      },
    });
  }

 async findAll(query: ListAgreementsDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.agreementWhereInput = {};

  if (query.status) where.status = query.status;
  if (query.type) where.type = query.type;

  const [items, total] = await this.prisma.$transaction([
    this.prisma.agreement.findMany({
      where,
      include: {
        company: true,
        vacancy: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip,
      take: limit,
    }),
    this.prisma.agreement.count({ where }),
  ]);

  return paginate(items, total, page, limit);
}

  async findMy(profileId: string) {
    const company = await this.prisma.company.findUnique({
      where: { profile_id: profileId },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return this.prisma.agreement.findMany({
      where: {
        company_id: company.id,
      },
      include: {
        vacancy: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  private ensureReviewable(agreementStatus: string) {
    if (agreementStatus === 'APPROVED') {
      throw new ForbiddenException('El convenio ya fue aprobado.');
    }

    if (agreementStatus === 'REJECTED') {
      throw new ForbiddenException('El convenio ya fue rechazado.');
    }
  }

  async approveByPractices(id: number) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id },
    });

    if (!agreement) {
      throw new NotFoundException('Convenio no encontrado');
    }

    this.ensureReviewable(agreement.status);

    if (
      agreement.type !== 'PRACTICE' &&
      agreement.type !== 'BOTH'
    ) {
      throw new ForbiddenException('Este convenio no pertenece a prácticas.');
    }

    await this.prisma.agreement.update({
      where: { id },
      data: {
        approved_by_practices: true,
      },
    });

    return this.updateFinalStatus(id);
  }

  async approveByPrelocation(id: number) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id },
    });

    if (!agreement) {
      throw new NotFoundException('Convenio no encontrado');
    }

    this.ensureReviewable(agreement.status);

    if (
      agreement.type !== 'PRELOCATION' &&
      agreement.type !== 'BOTH'
    ) {
      throw new ForbiddenException(
        'Este convenio no pertenece a prelocalización.',
      );
    }

    await this.prisma.agreement.update({
      where: { id },
      data: {
        approved_by_prelocation: true,
      },
    });

    return this.updateFinalStatus(id);
  }

  async reject(id: number) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id },
    });

    if (!agreement) {
      throw new NotFoundException('Convenio no encontrado');
    }

    this.ensureReviewable(agreement.status);

    return this.prisma.agreement.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });
  }

  private async updateFinalStatus(id: number) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id },
    });

    if (!agreement) {
      throw new NotFoundException('Convenio no encontrado');
    }

    if (agreement.type === 'BOTH') {
      if (agreement.approved_by_practices && agreement.approved_by_prelocation) {
        return this.prisma.agreement.update({
          where: { id },
          data: { status: 'APPROVED' },
        });
      }

      return agreement;
    }

    return this.prisma.agreement.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }
}
