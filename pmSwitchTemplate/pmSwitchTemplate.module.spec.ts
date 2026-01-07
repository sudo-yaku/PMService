import { Test, TestingModule } from '@nestjs/testing';
import { PmSwitchTemplateModule } from './pmSwitchTemplate.module';
import { PmSwitchTemplateController } from './pmSwitchTemplate.controller';
import { PmSwitchTemplateService } from './pmSwitchTemplate.service';
import { PmSwitchTemplateRepository } from './pmSwitchTemplate.repo';
import { OracleModule } from '../common/database/oracle.module';

describe('PmSwitchTemplateModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [OracleModule], // Import OracleModule for the module dependencies
      controllers: [PmSwitchTemplateController], // Add the controller
      providers: [PmSwitchTemplateService, PmSwitchTemplateRepository], // Add the service and repository
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined(); // Ensure the module is defined correctly
  });

  it('should inject PmSwitchTemplateController', () => {
    const controller = module.get<PmSwitchTemplateController>(PmSwitchTemplateController);
    expect(controller).toBeDefined(); // Ensure the controller is injected properly
  });

  it('should inject PmSwitchTemplateService', () => {
    const service = module.get<PmSwitchTemplateService>(PmSwitchTemplateService);
    expect(service).toBeDefined(); // Ensure the service is injected properly
  });

  it('should inject PmSwitchTemplateRepository', () => {
    const repo = module.get<PmSwitchTemplateRepository>(PmSwitchTemplateRepository);
    expect(repo).toBeDefined(); // Ensure the repository is injected properly
  });

  it('should import OracleModule', () => {
    const oracleModule = module.get<OracleModule>(OracleModule);
    expect(oracleModule).toBeDefined(); // Ensure OracleModule is properly imported
  });
});

