import { Test, TestingModule } from '@nestjs/testing';
import { RestClient } from './restClient.service';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

jest.mock('axios');
jest.mock('@nestjs/axios', () => ({
  HttpService: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

describe('RestClient', () => {
  let restClient: RestClient;
  let httpServiceMock: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestClient,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    restClient = module.get<RestClient>(RestClient);
    httpServiceMock = module.get(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('post method', () => {
    it('should make a POST request successfully', async () => {
      const baseURL = 'https://api.example.com';
      const headers = { 'Content-Type': 'application/json' };
      const data = { username: 'testuser' };
      const url = '/users';

      const mockResponse: AxiosResponse = {
        data: { id: 1, username: 'testuser' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      (httpServiceMock.post as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(await restClient.post(baseURL, headers, data, url));

      expect(result).toEqual(mockResponse);
      expect(httpServiceMock.post).toHaveBeenCalledWith(url, {
        baseURL,
        headers,
        data,
      });
    });

    it('should handle errors in post method', async () => {
      const baseURL = 'https://api.example.com';
      const headers = { 'Content-Type': 'application/json' };
      const data = { username: 'testuser' };
      const url = '/users';
      const error = new Error('Post Error');

      (httpServiceMock.post as jest.Mock).mockReturnValue(throwError(() => error));

      await expect(firstValueFrom(await restClient.post(baseURL, headers, data, url)))
        .rejects.toEqual(error);
    });
  });

  describe('get method', () => {
    it('should make a GET request successfully', async () => {
      const baseURL = 'https://api.example.com';
      const headers = { 'Content-Type': 'application/json' };
      const url = '/users';
      const parameters = { page: 1 };

      const mockResponse: AxiosResponse = {
        data: [{ id: 1, name: 'John' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      (httpServiceMock.get as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(restClient.get(baseURL, headers, url, {}, parameters));

      expect(result).toEqual(mockResponse);
      expect(httpServiceMock.get).toHaveBeenCalledWith(url, {
        baseURL,
        headers,
        timeout: 3000,
        params: parameters,
      });
    });

    it('should handle errors in get method', async () => {
      const baseURL = 'https://api.example.com';
      const error = new Error('Network Error');

      (httpServiceMock.get as jest.Mock).mockReturnValue(throwError(() => error));

      await expect(firstValueFrom(restClient.get(baseURL)))
        .rejects.toEqual(error);
    });
  });

  describe('update method', () => {
    it('should make an update request successfully', async () => {
      const data = { id: 1, name: 'Updated Name' };
      const url = 'https://api.example.com/users/1';
      const headers = { 'Authorization': 'Bearer token' };

      const mockResponse = { data: { id: 1, name: 'Updated Name' } };
      (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue(mockResponse);

      const result = await restClient.update(data, url, headers);

      expect(result).toEqual(data);
      expect(axios.post).toHaveBeenCalledWith(url, data, { headers });
    });

    it('should handle errors in update method', async () => {
      const data = { id: 1, name: 'Updated Name' };
      const url = 'https://api.example.com/users/1';
      const headers = { 'Authorization': 'Bearer token' };
      const error = new Error('Update Error');

      (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValue(error);

      const result = await restClient.update(data, url, headers);

      expect(result).toEqual(error);
    });
  });

  describe('put method', () => {
    it('should make a PUT request successfully', async () => {
      const data = { 
        id: 1, 
        name: 'Updated Name',
        headers: { 'Authorization': 'Bearer token' }
      };
      const url = 'https://api.example.com/users/1';

      const mockResponse = { data: { id: 1, name: 'Updated Name' } };
      (axios.put as jest.MockedFunction<typeof axios.put>).mockResolvedValue(mockResponse);

      const result = await restClient.put(data, url);

      expect(result).toEqual(mockResponse.data);
      expect(axios.put).toHaveBeenCalledWith(url, data, data.headers);
    });

    it('should handle error for PUT request failure', async () => {
        const data = { 
          id: 1, 
          name: 'Updated Name',
          headers: { 'Authorization': 'Bearer token' }
        };
        const url = 'https://api.example.com/users/1';
        const error = new Error('Error'); // Create an Error object with the message 'Error'
      
        // Mock the PUT request to reject with the error
        (axios.put as jest.MockedFunction<typeof axios.put>).mockRejectedValue(new Error);
      
        // Here, we check the full Error object using toEqual for deep equality
        await expect(restClient.put(data, url)).rejects.toEqual(error);
      });
      
  });

  describe('upsert method', () => {
    it('should make an upsert request successfully', async () => {
      const data = { id: 1, name: 'Upsert Name' };
      const url = 'https://api.example.com/users';
      const headers = { 'Authorization': 'Bearer token' };

      const mockResponse = { data: { id: 1, name: 'Upsert Name' } };
      (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue(mockResponse);

      const result = await restClient.upsert(data, url, headers);

      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(url, data, { headers });
    });

    it('should handle errors in upsert method', async () => {
      const data = { id: 1, name: 'Upsert Name' };
      const url = 'https://api.example.com/users';
      const headers = { 'Authorization': 'Bearer token' };
      const error = new Error('Upsert Error');

      (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValue(error);

      const result = await restClient.upsert(data, url, headers);

      expect(result).toEqual(error);
    });
  });
});