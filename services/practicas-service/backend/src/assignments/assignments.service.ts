import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  agreement_status,
  agreement_type,
  call_status,
  vacancy_status,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findCallOrFail(callId: number) {
    const call = await this.prisma.prelocalization_call.findUnique({
      where: { id: callId },
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

    if (!call) {
      throw new NotFoundException('Convocatoria no encontrada.');
    }

    return call;
  }

  private async getNextEligibleRanking(callId: number) {
    return this.prisma.prelocalization_ranking.findFirst({
      where: {
        prelocalization_call_id: callId,
        student: {
          prelocalization_assignment: {
            none: {
              prelocalization_call_id: callId,
            },
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        student: {
          include: {
            profiles: {
              select: {
                id: true,
                full_name: true,
              },
            },
            career: true,
            municipality: true,
          },
        },
      },
    });
  }

  private async getEligibleVacancies(callId: number) {
    const vacancies = await this.prisma.vacancy.findMany({
      where: {
        status: vacancy_status.OPEN,
        agreement: {
          status: agreement_status.APPROVED,
          type: {
            in: [agreement_type.PRELOCATION, agreement_type.BOTH],
          },
        },
      },
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
        prelocalization_assignment: {
          where: {
            prelocalization_call_id: callId,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return vacancies.filter(
      (vacancy) => vacancy.prelocalization_assignment.length < vacancy.slots,
    );
  }

  async manage(callId: number) {
    const call = await this.findCallOrFail(callId);

    const nextRanking = await this.getNextEligibleRanking(callId);
    const vacancies = await this.getEligibleVacancies(callId);

    const assignments = await this.prisma.prelocalization_assignment.findMany({
      where: {
        prelocalization_call_id: callId,
      },
      include: {
        student: {
          include: {
            profiles: {
              select: {
                id: true,
                full_name: true,
              },
            },
            career: true,
            municipality: true,
          },
        },
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
        prelocalization_call: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const ranking = await this.prisma.prelocalization_ranking.findMany({
      where: {
        prelocalization_call_id: callId,
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        student: {
          include: {
            profiles: {
              select: {
                id: true,
                full_name: true,
              },
            },
            career: true,
            municipality: true,
          },
        },
      },
    });

    const byMunicipality = nextRanking
      ? vacancies.filter(
          (vacancy) =>
            vacancy.agreement.company.municipality_id ===
            nextRanking.student.municipality_id, // corregido: municipality_id según el esquema
        )
      : [];

    return {
      call,
      nextStudent: nextRanking?.student ?? null,
      vacancies,
      byMunicipality,
      ranking,
      assignments,
    };
  }

  async assign(callId: number, vacancyId: number) {
    const call = await this.findCallOrFail(callId);

    if (call.status === call_status.CLOSED) {
      throw new ForbiddenException('La convocatoria está cerrada.');
    }

    const nextRanking = await this.getNextEligibleRanking(callId);

    if (!nextRanking) {
      return {
        message: 'Todas las asignaciones fueron completadas.',
      };
    }

    const vacancy = await this.prisma.vacancy.findFirst({
      where: {
        id: vacancyId,
        status: vacancy_status.OPEN,
        agreement: {
          status: agreement_status.APPROVED,
          type: {
            in: [agreement_type.PRELOCATION, agreement_type.BOTH],
          },
        },
      },
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
        prelocalization_assignment: {
          where: {
            prelocalization_call_id: callId,
          },
        },
      },
    });

    if (!vacancy) {
      throw new ForbiddenException(
        'La vacante no está disponible para este proceso.',
      );
    }

    const currentAssignments = vacancy.prelocalization_assignment.length;

    if (currentAssignments >= vacancy.slots) {
      throw new ForbiddenException('La vacante ya está llena.');
    }

    return this.prisma.prelocalization_assignment.create({
      data: {
        prelocalization_call_id: callId,
        student_id: nextRanking.student.id,
        vacancy_id: vacancy.id,
        academic_year: call.academic_year,
      },
      include: {
        student: {
          include: {
            profiles: {
              select: {
                id: true,
                full_name: true,
              },
            },
            career: true,
            municipality: true,
          },
        },
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
        prelocalization_call: true,
      },
    });
  }
}