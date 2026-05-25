import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { call_status, vacancy_status } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async superAdminSummary() {
    const [
      activeUsers,
      openCalls,
      closedCalls,
      studentsWithoutAssignment,
      openVacancies,
      assignedStudents,
    ] = await Promise.all([
      this.prisma.profiles.count(),

      this.prisma.prelocalization_call.count({
        where: { status: call_status.OPEN },
      }),

      this.prisma.prelocalization_call.count({
        where: { status: call_status.CLOSED },
      }),

      this.prisma.student.count({
        where: {
          academic_year: 4,
          prelocalization_assignment: {
            none: {},
          },
        },
      }),

      this.prisma.vacancy.count({
        where: { status: vacancy_status.OPEN },
      }),

      this.prisma.prelocalization_assignment.count(),
    ]);

    return {
      activeUsers,
      openCalls,
      closedCalls,
      studentsWithoutAssignment,
      openVacancies,
      assignedStudents,
    };
  }
}