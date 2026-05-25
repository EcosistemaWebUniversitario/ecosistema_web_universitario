import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PrelocalizationController } from './prelocalization.controller';
import { PrelocalizationService } from './prelocalization.service';
import { PrelocalizationResultsController } from './prelocalization-results.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PrelocalizationController,
                PrelocalizationResultsController,
  ],
  providers: [PrelocalizationService],
})
export class PrelocalizationModule {}