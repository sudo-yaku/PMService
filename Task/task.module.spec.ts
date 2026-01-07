import { Test, TestingModule } from '@nestjs/testing';
import { TaskModule } from './task.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import taskrepo from './task.repo';
import { OracleModule } from '../common/database/oracle.module';

// Mocking taskrepo and OracleModule to avoid actual database interaction
jest.mock('./task.repo');
jest.mock('../common/database/oracle.module');

describe('TaskModule', () => {
  let module: TestingModule;
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [OracleModule], // OracleModule is imported here
      controllers: [TaskController], // TaskController is used here
      providers: [TaskService, taskrepo], // TaskService and taskrepo are the providers
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(module).toBeDefined(); // Ensure the module is correctly initialized
  });

  it('should inject TaskController', () => {
    expect(taskController).toBeDefined(); // Ensure TaskController is correctly injected
  });

  it('should inject TaskService', () => {
    expect(taskService).toBeDefined(); // Ensure TaskService is correctly injected
  });

  it('should inject taskrepo', () => {
    const taskRepo = module.get<typeof taskrepo>(taskrepo);
    expect(taskRepo).toBeDefined(); // Ensure taskrepo is correctly injected
  });

  it('should import OracleModule', () => {
    const oracleModule = module.get<OracleModule>(OracleModule);
    expect(oracleModule).toBeDefined(); // Ensure OracleModule is correctly imported
  });
});
