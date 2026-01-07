import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Request, Response } from 'express';
import logger from '../common/logger/logger';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            PmData: jest.fn(),
          },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should return tasks when PmData is found', async () => {
    // Arrange
    const mockPmData = [{ id: 1, name: 'Task 1' }];
    (taskService.PmData as jest.Mock).mockResolvedValue(mockPmData);

    const mockRequest: Partial<Request> = {}; // Mock request object

    // Act
    await taskController.getTasksByPm('pmHeaderId', mockRequest as Request, mockResponse as Response);

    // Assert
    expect(taskService.PmData).toHaveBeenCalledWith('pmHeaderId');
    expect(mockResponse.send).toHaveBeenCalledWith(mockPmData);
    expect(mockResponse.status).not.toHaveBeenCalled(); // Should not call status if successful
  });

  it('should return 204 when no tasks are found', async () => {
    // Arrange
    (taskService.PmData as jest.Mock).mockResolvedValue([]);

    const mockRequest: Partial<Request> = {}; // Mock request object

    // Act
    await taskController.getTasksByPm('pmHeaderId', mockRequest as Request, mockResponse as Response);

    // Assert
    expect(taskService.PmData).toHaveBeenCalledWith('pmHeaderId');
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  it('should return 500 when an error is thrown', async () => {
    // Arrange
    const mockError = new Error('Some error');
    (taskService.PmData as jest.Mock).mockRejectedValue(mockError);

    const mockRequest: Partial<Request> = {}; // Mock request object

    // Act
    await taskController.getTasksByPm('pmHeaderId', mockRequest as Request, mockResponse as Response);

    
  });
});