import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Automation } from './entities/automation.entity';
import { AutomationService } from './services/automation.service';
import { CrmModule } from '../crm/crm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Automation]), CrmModule],
  providers: [AutomationService],
  exports: [AutomationService],
})
export class AutomationModule {}
