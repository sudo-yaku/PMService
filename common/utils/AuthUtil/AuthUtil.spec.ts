import { Test, TestingModule } from '@nestjs/testing';
import { AuthUtil } from './AuthUtil';  // Adjust the import path as needed
import { RestClient } from '../restClient/restClient.service';
import logger from '../../logger/logger';  // Adjust the import path as needed
import { of, throwError } from 'rxjs';

jest.mock('../../logger/logger');  // Mock the logger module
jest.mock('config', () => ({
  userService: { url: 'https://fake-url.com' },
  app: { authHeader: 'Bearer fake-token' }
}));

describe('AuthUtil', () => {
  let authUtil: AuthUtil;
  let restClient: RestClient;
  const mockRestClientGet = jest.fn();  // Mock the RestClient.get method

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUtil,
        {
          provide: RestClient,
          useValue: {
            get: mockRestClientGet
          }
        }
      ]
    }).compile();

    authUtil = module.get<AuthUtil>(AuthUtil);
    restClient = module.get<RestClient>(RestClient);
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clear all mocks to avoid cross-test contamination
  });

  it('should populate global usersList when result is valid', async () => {
    const mockResponse = {
      data: { users: ['user1', 'user2', 'user3'] }
    };

    // Mock the RestClient's get method to return the mocked response
    mockRestClientGet.mockReturnValue(of(mockResponse));

    // Call the method
    await authUtil.populateUsersInMap();

    // Assertions
    expect(mockRestClientGet).toHaveBeenCalledWith('https://fake-url.com/all/memory', {
      "Accept": "application/json",
      "Authorization": "Bearer fake-token"
    });
    expect(global.usersList).toEqual(['user1', 'user2', 'user3']);
    expect(logger.debug).not.toHaveBeenCalled();  // Ensure no debug log if the result is valid
  });


  it('should throw an error if RestClient.get fails', async () => {
    const error = new Error('API call failed');

    // Mock the RestClient's get method to throw an error
    mockRestClientGet.mockReturnValue(throwError(() => error));

    // Call the method and assert that it throws an error
    await expect(authUtil.populateUsersInMap()).rejects.toThrowError(error);
  });
});
