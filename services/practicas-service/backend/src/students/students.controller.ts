import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Interfaz tipada para el request con el usuario autenticado
interface AuthenticatedRequest extends Request {
  user: {
    id: string;   // UUID del perfil (profile_id)
    email: string;
  };
}

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles('estudiante')
  @Post('profile')
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(req.user.id, dto);
  }

  @Roles('estudiante')
  @Get('me')
  getMyProfile(@Req() req: AuthenticatedRequest) {
    return this.studentsService.findMyProfile(req.user.id);
  }

  @Roles('estudiante')
  @Patch('me')
  updateMyProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.studentsService.updateMyProfile(req.user.id, dto);
  }

  @Roles('estudiante')
  @Patch('me/password')
  changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.studentsService.changePassword(req.user.id, dto);
  }
}