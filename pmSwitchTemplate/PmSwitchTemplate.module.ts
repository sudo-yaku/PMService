import { Module } from '@nestjs/common';
import { OracleModule } from '../common/database/oracle.module';
import { PmSwitchTemplateController } from './PmSwitchTemplate.controller';
import { PmSwitchTemplateService } from './PmSwitchTemplate.service';
import { PmSwitchTemplateRepository } from './PmSwitchTemplate.repo';

@Module({
  imports: [OracleModule],
  controllers: [PmSwitchTemplateController],
  providers: [PmSwitchTemplateService, PmSwitchTemplateRepository],
})
export class PmSwitchTemplateModule {}
