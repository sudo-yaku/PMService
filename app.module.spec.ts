import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OracleModule } from './common/database/oracle.module';
import { PmSiteModule } from './pmSite/pmSite.module';
import { PmSwitchTemplateModule } from './pmSwitchTemplate/PmSwitchTemplate.module';
import { UpdateGenReadingModule } from './updateGenReading/updateGenReading.module';
import { GenReadingModule } from './GenReading/genreading.module';
import { TaskModule } from './Task/task.module';
import { SwitchTaskModule } from './SwitchTask/switchTask.module';
import { UpdateTaskModule } from './updateTask/UpdateTask.module';
import { UpdateSwitchTaskModule } from './updateSwitchTask/updateSwitchTask.module';
import { TaskForManagerModule } from './getTaskForManager/getTaskForManager.module';
import { PmMgrSummModule } from './pmMgrSumm/pmMgrSumm.module';
import { PmTechSummModule } from './pmTechSumm/pmTechSumm.module';
import { RestClientModule } from './common/utils/restClient/restClient.module';
import { AuthUtil } from './common/utils/AuthUtil/AuthUtil';
import { PmSiteTemplateModule } from './pmSiteTemplate/pmSiteTemplate.module';
import { TaskSummaryByCalloutZoneModule } from './taskSummaryByCalloutZone/taskSummaryByCalloutZone.module';
import {OpsScorecardSiteModule} from './opsScorecardSite/opsScorecardSite.module' 
// Mock the Oracle class itself
jest.mock('./common/database/oracle', () => {
  return {
    Oracle: jest.fn().mockImplementation(() => ({
      executeQuery: jest.fn().mockResolvedValue({ rows: [] }), // Mock `executeQuery`
    })),
  };
});

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    // Create the testing module with imports, controllers, and providers
    module = await Test.createTestingModule({
      imports: [
        OracleModule, // OracleModule is included
        PmSiteModule, // Your PmSiteModule
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
        PmTechSummModule,
        TaskSummaryByCalloutZoneModule,
        OpsScorecardSiteModule,
        RestClientModule,  // Ensure RestClientModule is included
      ],
      controllers: [AppController],  // Include the controller to test
      providers: [AppService, AuthUtil],  // Ensure AppService and AuthUtil are included
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();  // Ensure the module compiles correctly
  });

  it('should inject AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();  // Ensure the AppController is injected correctly
  });

  it('should inject AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();  // Ensure the AppService is injected correctly
  });

  it('should inject AuthUtil', () => {
    const authUtil = module.get<AuthUtil>(AuthUtil);
    expect(authUtil).toBeDefined();  // Ensure the AuthUtil is injected correctly
  });

  it('should import OracleModule', () => {
    const oracleModule = module.get<OracleModule>(OracleModule);
    expect(oracleModule).toBeDefined();  // Ensure OracleModule is imported correctly
  });

  it('should import PmSiteModule', () => {
    const pmSiteModule = module.get<PmSiteModule>(PmSiteModule);
    expect(pmSiteModule).toBeDefined();  // Ensure PmSiteModule is imported correctly
  });

  it('should import PmSiteTemplateModule', () => {
    const pmSiteTemplateModule = module.get<PmSiteTemplateModule>(PmSiteTemplateModule);
    expect(pmSiteTemplateModule).toBeDefined();  // Ensure PmSiteTemplateModule is imported correctly
  });

  it('should import TaskForManagerModule', () => {
    const taskForManagerModule = module.get<TaskForManagerModule>(TaskForManagerModule);
    expect(taskForManagerModule).toBeDefined();  // Ensure TaskForManagerModule is imported correctly
  });

  it('should import PmSwitchTemplateModule', () => {
    const pmSwitchTemplateModule = module.get<PmSwitchTemplateModule>(PmSwitchTemplateModule);
    expect(pmSwitchTemplateModule).toBeDefined();  // Ensure PmSwitchTemplateModule is imported correctly
  });

  it('should import UpdateGenreadingModule', () => {
    const updateGenreadingModule = module.get<UpdateGenReadingModule>(UpdateGenReadingModule);
    expect(updateGenreadingModule).toBeDefined();  // Ensure updateGenreadingModule is imported correctly
  });

  it('should import GenReadingModule', () => {
    const genReadingModule = module.get<GenReadingModule>(GenReadingModule);
    expect(genReadingModule).toBeDefined();  // Ensure GenReadingModule is imported correctly
  });

  it('should import TaskModule', () => {
    const taskModule = module.get<TaskModule>(TaskModule);
    expect(taskModule).toBeDefined();  // Ensure TaskModule is imported correctly
  });

  it('should import SwitchTaskModule', () => {
    const switchTaskModule = module.get<SwitchTaskModule>(SwitchTaskModule);
    expect(switchTaskModule).toBeDefined();  // Ensure SwitchTaskModule is imported correctly
  });

  it('should import GenReadingModule', () => {
    const updateTaskModule = module.get<UpdateTaskModule>(UpdateTaskModule);
    expect(updateTaskModule).toBeDefined();  // Ensure UpdateTaskModule is imported correctly
  });

  it('should import UpdateSwitchTaskModule', () => {
    const updateSwitchTaskModule = module.get<UpdateSwitchTaskModule>(UpdateSwitchTaskModule);
    expect(updateSwitchTaskModule).toBeDefined();  // Ensure UpdateSwitchTaskModule is imported correctly
  });

  it('should import PmMgrSummModule', () => {
    const pmMgrSummModule = module.get<PmMgrSummModule>(PmMgrSummModule);
    expect(pmMgrSummModule).toBeDefined();  // Ensure PmMgrSummModule is imported correctly
  });

  it('should import PmTechSummModule', () => {
    const pmTechSummModule = module.get<PmTechSummModule>(PmTechSummModule);
    expect(pmTechSummModule).toBeDefined();  // Ensure PmTechSummModule is imported correctly
  });

  it('should import TaskSummaryByCalloutZoneModule', () => {
    const taskSummaryByCalloutZoneModule = module.get<TaskSummaryByCalloutZoneModule>(TaskSummaryByCalloutZoneModule);
    expect(taskSummaryByCalloutZoneModule).toBeDefined();  // Ensure TaskSummaryByCalloutZoneModule is imported correctly
  });

  it('should import OpsScorecardSiteModule', () => {
    const opsScorecardSiteModule = module.get<OpsScorecardSiteModule>(OpsScorecardSiteModule);
    expect(opsScorecardSiteModule).toBeDefined();  // Ensure OpsScorecardSiteModule is imported correctly
  });

  it('should import RestClientModule', () => {
    const restClientModule = module.get<RestClientModule>(RestClientModule);
    expect(restClientModule).toBeDefined();  // Ensure RestClientModule is imported correctly
  });
});
