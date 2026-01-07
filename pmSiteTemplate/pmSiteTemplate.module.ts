import { Module } from '@nestjs/common';
import { OracleModule } from '../common/database/oracle.module';
import { PmSiteTemplateController } from './pmSiteTemplate.controller';
import { PmSiteTemplateService } from './pmSiteTemplate.service';
import { PmSiteTemplateRepository } from './pmSiteTemplate.repo';

@Module({
  imports: [OracleModule],
  controllers: [PmSiteTemplateController],
  providers: [PmSiteTemplateService, PmSiteTemplateRepository],
})
export class PmSiteTemplateModule {}
