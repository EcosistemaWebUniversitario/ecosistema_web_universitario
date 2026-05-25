import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { CompaniesModule } from './companies/companies.module';
import { AgreementsModule } from './agreements/agreements.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { RequestsModule } from './requests/requests.module';
import { PrelocalizationModule } from './prelocalization/prelocalization.module';
import { RankingModule } from './ranking/ranking.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CareersModule } from './careers/careers.module';
import { MunicipalitiesModule } from './municipalities/municipalities.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
       // Si estamos en desarrollo, cargar .env.local primero, luego .env
  envFilePath: process.env.NODE_ENV === 'development'
    ? ['.env.local', '.env']
    : '.env',
    }),
    PrismaModule,
    AuthModule,
    AgreementsModule,
    StudentsModule,
    CompaniesModule,
    VacanciesModule,
    RequestsModule,
    PrelocalizationModule,
    RankingModule,
    AssignmentsModule,
    DashboardModule,
    CareersModule,
    MunicipalitiesModule,
    SupabaseModule,
    
  ],
   controllers: [AppController],
})
export class AppModule {}
