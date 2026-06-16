import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { call_status } from '@prisma/client';

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔍 Obtener una convocatoria con su ranking
  async findOneCall(callId: number) {
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
        prelocalization_ranking: {
          orderBy: { position: 'asc' },
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
        },
      },
    });

    if (!call) {
      throw new NotFoundException('Convocatoria no encontrada.');
    }

    return call;
  }

  // 📊 Datos para construir ranking
  async getData(callId: number) {
    const call = await this.findOneCall(callId);

    const students = await this.prisma.student.findMany({
      where: {
        career_id: call.career_id,
        academic_year: call.academic_year,

        // 🚫 No en ranking
        prelocalization_ranking: {
          none: {
            prelocalization_call_id: call.id,
          },
        },

        // 🚫 No asignados
        prelocalization_assignment: {
          none: {
            academic_year: call.academic_year,
          },
        },
      },
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
      orderBy: [
        { surnames: 'asc' },
        { names: 'asc' },
      ],
    });

    // Mapear estudiantes disponibles para que tengan firstName y lastName
    const mappedStudents = students.map((s) => ({
      ...s,
      firstName: s.names,
      lastName: s.surnames,
    }));

    // Mapear ranking para que cada item.student tenga firstName y lastName
    const mappedRanking = call.prelocalization_ranking.map((item) => ({
      ...item,
      student: {
        ...item.student,
        firstName: item.student.names,
        lastName: item.student.surnames,
      },
    }));

    return {
      call: {
        id: call.id,
        academicYear: call.academic_year,
        status: call.status,
        career: call.career,
        creator: call.profiles,
      },
      students: mappedStudents,
      ranking: mappedRanking,
    };
  }

  // ➕ Agregar estudiante al ranking
  async create(callId: number, dto: CreateRankingDto) {
    const call = await this.prisma.prelocalization_call.findUnique({
      where: { id: callId },
    });

    if (!call) {
      throw new NotFoundException('Convocatoria no encontrada.');
    }

    if (call.status === call_status.CLOSED) {
      throw new ForbiddenException('La convocatoria está cerrada.');
    }

    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado.');
    }

    // 🔒 Validar carrera
    if (student.career_id !== call.career_id) {
      throw new ForbiddenException(
        'El estudiante no pertenece a la carrera de esta convocatoria.',
      );
    }

    // 🔒 Validar año académico
    if (student.academic_year !== call.academic_year) {
      throw new ForbiddenException(
        'El estudiante no pertenece al año académico de esta convocatoria.',
      );
    }

    // 🔒 Ya asignado
    const alreadyAssigned =
      await this.prisma.prelocalization_assignment.findFirst({
        where: {
          student_id: student.id,
          academic_year: call.academic_year,
        },
      });

    if (alreadyAssigned) {
      throw new ConflictException(
        'Este estudiante ya tiene una asignación registrada.',
      );
    }

    // 🔒 Ya en ranking
    const alreadyInRanking =
      await this.prisma.prelocalization_ranking.findFirst({
        where: {
          prelocalization_call_id: call.id,
          student_id: student.id,
        },
      });

    if (alreadyInRanking) {
      throw new ConflictException(
        'Este estudiante ya está en el ranking.',
      );
    }

    // 🔒 Posición ocupada
    const positionTaken =
      await this.prisma.prelocalization_ranking.findFirst({
        where: {
          prelocalization_call_id: call.id,
          position: dto.position,
        },
      });

    if (positionTaken) {
      throw new ConflictException(
        'Esa posición ya está ocupada.',
      );
    }

    return this.prisma.prelocalization_ranking.create({
      data: {
        prelocalization_call_id: call.id,
        student_id: student.id,
        position: dto.position,
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

  // ❌ Eliminar del ranking
  async remove(id: number) {
    const ranking = await this.prisma.prelocalization_ranking.findUnique({
      where: { id },
    });

    if (!ranking) {
      throw new NotFoundException(
        'Registro del ranking no encontrado.',
      );
    }

    return this.prisma.prelocalization_ranking.delete({
      where: { id },
    });
  }
}