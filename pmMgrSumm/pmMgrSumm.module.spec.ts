import { Test, TestingModule } from '@nestjs/testing';
import { PmMgrSummModule } from './pmMgrSumm.module';
import { PmMgrSummController } from './pmMgrSumm.controller';
import { PmMgrSummService } from './pmMgrSumm.service';
import PmMgrSummrepo from './pmMgrSumm.repo';
import { OracleModule } from '../common/database/oracle.module';

describe('PmMgrSummModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [OracleModule], // Import OracleModule to the test
      controllers: [PmMgrSummController], // Include the controller in the test
      providers: [PmMgrSummService, PmMgrSummrepo], // Include the service and repo in the test
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined(); // Ensure the module is defined and properly compiled
  });

  it('should inject PmMgrSummController', () => {
    const controller = module.get<PmMgrSummController>(PmMgrSummController);
    expect(controller).toBeDefined(); // Ensure the controller is properly injected
  });

  it('should inject PmMgrSummService', () => {
    const service = module.get<PmMgrSummService>(PmMgrSummService);
    expect(service).toBeDefined(); // Ensure the service is properly injected
  });

  it('should inject PmMgrSummrepo', () => {
    const repo = module.get<PmMgrSummrepo>(PmMgrSummrepo);
    expect(repo).toBeDefined(); // Ensure the repository is properly injected
  });

  it('should import OracleModule', () => {
    const oracleModule = module.get<OracleModule>(OracleModule);
    expect(oracleModule).toBeDefined(); // Ensure OracleModule is correctly imported and available
  });
});
