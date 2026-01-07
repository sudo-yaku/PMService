import { Module } from '@nestjs/common';
import { OracleModule } from '../common/database/oracle.module';
import { PmMgrSummController } from './pmMgrSumm.controller';
import { PmMgrSummService } from './pmMgrSumm.service';
import PmMgrSummrepo from './pmMgrSumm.repo';

@Module({
    imports: [OracleModule],
    controllers: [PmMgrSummController],
    providers: [PmMgrSummService, PmMgrSummrepo],
})
export class PmMgrSummModule { }
