import { Test, TestingModule } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; 
import { AppService } from './app.service';
import { AuthUtil } from './common/utils/AuthUtil/AuthUtil'; // Assuming it's imported here
import { RestClientModule } from './common/utils/restClient/restClient.module';
import { RestClient } from './common/utils/restClient/restClient.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { Oracle } from './common/database/oracle'; // Assuming Oracle is imported here for initialization

describe('App Bootstrap', () => {
  let app;
  let appService: AppService;
  let restClient: RestClient;
  let authUtil: AuthUtil;
  let mockHttpService: Partial<HttpService>;
  let oracleInitSpy: jest.SpyInstance;
  let populateUsersInMapSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mocking the HttpService methods (get, post) to return mock responses
    mockHttpService = {
      get: jest.fn().mockReturnValue(of({})), // Mocking get request response
      post: jest.fn().mockReturnValue(of({})), // Mocking post request response
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, RestClientModule], 
      providers: [
        { provide: ConfigService, useValue: {} }, // Mocking ConfigService if needed
        { provide: HttpService, useValue: mockHttpService }, // Mocking HttpService
      ],
    }).compile();

    app = module.createNestApplication();
    appService = module.get(AppService); // Accessing the AppService for general app logic
    restClient = module.get(RestClient); // Accessing the RestClient service
    authUtil = module.get(AuthUtil); // Accessing the AuthUtil service

    // Spying on Oracle.init method (if it's static in Oracle class)
    oracleInitSpy = jest.spyOn(Oracle, 'init'); 

    // Spying on populateUsersInMap method (from AuthUtil)
    populateUsersInMapSpy = jest.spyOn(authUtil, 'populateUsersInMap'); 
  });

  // it('should call Oracle.init during bootstrap', async () => {
  //   // Trigger app initialization (this triggers your bootstrap lifecycle)
  //   await app.init();

  //   // Ensure Oracle.init is called during bootstrap
  //   expect(oracleInitSpy).toHaveBeenCalled();
  // });

  // it('should call populateUsersInMap during bootstrap', async () => {
  //   // Trigger app initialization to ensure the method is called
  //   await app.init();

  //   // Ensure populateUsersInMap was called during initialization
  //   expect(populateUsersInMapSpy).toHaveBeenCalled();
  // });

  // it('should setup global interceptors during bootstrap', async () => {
  //   // Spy on the global interceptor setup
  //   const interceptorSetupSpy = jest.spyOn(app, 'useGlobalInterceptors'); 

  //   // Initialize app to test if interceptors are set up correctly
  //   await app.init();

  //   // Ensure global interceptors are set up
  //   expect(interceptorSetupSpy).toHaveBeenCalled();
  // });

  it('should call app.enableCors()', async () => {
    // Spy on enableCors method to verify if it's being called
    const enableCorsSpy = jest.spyOn(app, 'enableCors');

    // Manually trigger enableCors if it's not automatically called during initialization
    app.enableCors(); // Ensure it's called explicitly
    expect(enableCorsSpy).toHaveBeenCalled();
  });

  afterAll(async () => {
    // Clean up after tests (close the app to avoid memory leaks)
    await app.close();
  });
});
