
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    // Create the testing module and inject the AppService
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    // Get the instance of AppService
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    // Ensure the service is defined
    expect(service).toBeDefined();
  });

  it('should return "Hello World!"', () => {
    // Call the getHello method and check if it returns the expected string
    expect(service.getHello()).toBe('Hello World!');
  });
});
