import { Module } from '@nestjs/common';
import { OracleModule } from '../common/database/oracle.module';
import { PmSiteController } from './pmSite.controller';
import { PmSiteService } from './pmSite.service';
import PmSiteRepo from './pmSite.repo';

@Module({
  imports: [OracleModule],
  controllers: [PmSiteController],
  providers: [PmSiteService,PmSiteRepo],
})
export class PmSiteModule {}
