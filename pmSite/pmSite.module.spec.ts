import { Test, TestingModule } from '@nestjs/testing';
import { PmSiteModule } from './pmSite.module';
import { PmSiteController } from './pmSite.controller';
import { PmSiteService } from './pmSite.service';
import PmSiteRepo from './pmSite.repo';
import { OracleModule } from '../common/database/oracle.module';

describe('PmSiteModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [OracleModule], // Import OracleModule
      controllers: [PmSiteController], // Include the controller
      providers: [PmSiteService, PmSiteRepo], // Include the service and repository
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined(); // Ensure the module is defined correctly
  });

  it('should inject PmSiteController', () => {
    const controller = module.get<PmSiteController>(PmSiteController);
    expect(controller).toBeDefined(); // Ensure the controller is injected correctly
  });

  it('should inject PmSiteService', () => {
    const service = module.get<PmSiteService>(PmSiteService);
    expect(service).toBeDefined(); // Ensure the service is injected correctly
  });

  it('should inject PmSiteRepo', () => {
    const repo = module.get<PmSiteRepo>(PmSiteRepo);
    expect(repo).toBeDefined(); // Ensure the repository is injected correctly
  });

  it('should import OracleModule', () => {
    const oracleModule = module.get<OracleModule>(OracleModule);
    expect(oracleModule).toBeDefined(); // Ensure OracleModule is imported and available
  });
});
