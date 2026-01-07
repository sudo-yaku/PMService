import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OracleModule } from './common/database/oracle.module';
import { PmSiteTemplateModule } from './pmSiteTemplate/pmSiteTemplate.module';
import { PmSiteModule } from './pmSite/pmSite.module';
import { PmSwitchTemplateModule } from './pmSwitchTemplate/PmSwitchTemplate.module';
import { UpdateGenReadingModule } from './updateGenReading/updategenreading.module';
import { GenReadingModule } from './GenReading/genreading.module';
import { TaskModule } from './Task/task.module';
import { SwitchTaskModule } from './SwitchTask/switchTask.module';
import { UpdateTaskModule } from './updateTask/UpdateTask.module';
import { UpdateSwitchTaskModule } from './updateSwitchTask/updateSwitchTask.module';
import { TaskForManagerModule } from './getTaskForManager/getTaskForManager.module';
import { PmMgrSummModule } from './pmMgrSumm/pmMgrSumm.module';
import { PmTechSummModule } from './pmTechSumm/pmTechSumm.module';
import { switchSummaryModule } from './switchSummary/switchSummary.module';
import { RestClientModule } from './common/utils/restClient/restClient.module';
import { AuthUtil } from './common/utils/AuthUtil/AuthUtil';
import { GenInfoModule } from './Geninfo/genInfo.module';
import { TaskSummaryByCalloutZoneModule } from './taskSummaryByCalloutZone/taskSummaryByCalloutZone.module';
import { GenInfoSwitchModule } from './GenInfoSwitch/GenInfoSwitch.module';
import { OpsScorecardSwitchModule } from './opsScorecardSwitch/opsScorecardSwitch.module';
import {OpsScorecardSiteModule} from './opsScorecardSite/opsScorecardSite.module';
import { UpdatePmdTasksModule } from './updatePmdTasks/updatePmdTasks.module';
import { UpdatePmdWidgetModule } from './updatePmdWidget/updatePmdWidget.module';


@Module({
  imports: [
    OracleModule,
    PmSiteModule,
    PmSiteTemplateModule,
    TaskForManagerModule,
    PmSwitchTemplateModule,
    UpdateGenReadingModule,
    GenReadingModule,
    TaskModule,
    SwitchTaskModule,
    UpdateTaskModule,
    UpdateSwitchTaskModule,
    PmMgrSummModule,
    switchSummaryModule,
    GenInfoModule,
    GenInfoSwitchModule,
    PmTechSummModule,
    TaskSummaryByCalloutZoneModule,
    RestClientModule,
    OpsScorecardSwitchModule,
    OpsScorecardSiteModule,
    UpdatePmdWidgetModule,
    UpdatePmdTasksModule
  
  ],
  controllers: [AppController],
  providers: [AppService, AuthUtil],
})
export class AppModule {}
