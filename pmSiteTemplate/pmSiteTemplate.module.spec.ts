import { Test, TestingModule } from '@nestjs/testing';
import { PmSiteTemplateModule } from './pmSiteTemplate.module';
import { PmSiteTemplateController } from './pmSiteTemplate.controller';
import { PmSiteTemplateService } from './pmSiteTemplate.service';
import { PmSiteTemplateRepository } from './pmSiteTemplate.repo';
import { OracleModule } from '../common/database/oracle.module';

describe('PmSiteTemplateModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [OracleModule], // Import OracleModule for the module dependencies
      controllers: [PmSiteTemplateController], // Add the controller
      providers: [PmSiteTemplateService, PmSiteTemplateRepository], // Add the service and repository
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined(); // Ensure the module is defined correctly
  });

  it('should inject PmSiteTemplateController', () => {
    const controller = module.get<PmSiteTemplateController>(PmSiteTemplateController);
    expect(controller).toBeDefined(); // Ensure the controller is injected properly
  });

  it('should inject PmSiteTemplateService', () => {
    const service = module.get<PmSiteTemplateService>(PmSiteTemplateService);
    expect(service).toBeDefined(); // Ensure the service is injected properly
  });

  it('should inject PmSiteTemplateRepository', () => {
    const repo = module.get<PmSiteTemplateRepository>(PmSiteTemplateRepository);
    expect(repo).toBeDefined(); // Ensure the repository is injected properly
  });

  it('should import OracleModule', () => {
    const oracleModule = module.get<OracleModule>(OracleModule);
    expect(oracleModule).toBeDefined(); // Ensure OracleModule is properly imported
  });
});

