import { Test, TestingModule } from '@nestjs/testing';
import { PmSwitchTemplateController } from './PmSwitchTemplate.controller';
import { PmSwitchTemplateService } from './PmSwitchTemplate.service';
import { Request, Response } from 'express';

jest.mock('../common/logger/logger'); 

describe('PmSwitchTemplateController', () => {
  let controller: PmSwitchTemplateController;
  let service: PmSwitchTemplateService;
  let res: Response;
  let req: Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmSwitchTemplateController],
      providers: [
        {
          provide: PmSwitchTemplateService,
          useValue: {
            getPmTemplates: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PmSwitchTemplateController>(PmSwitchTemplateController);
    service = module.get<PmSwitchTemplateService>(PmSwitchTemplateService);
    req = {} as Request;
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return PM templates for the switch when found', async () => {
    const switchUnId = 'testSwitchId';
    const mockTemplates = [
      {
        TEMPLATE_NAME: 'Template1',
        LIST_TEMPLATE_ID: '1',
        TEMPLATE_DESC: 'Description 1',
        IS_DISABLED: false,
        FREQUENCY_NAME: 'Weekly',
      },
    ];
    const result = { rows: mockTemplates };

    jest.spyOn(service, 'getPmTemplates').mockResolvedValue(result);

    await controller.getPmTemplateBySwitch(switchUnId, req, res);

    expect(service.getPmTemplates).toHaveBeenCalledWith(switchUnId);
    expect(res.json).toHaveBeenCalledWith({
      switchUnId: switchUnId,
      templates: [
        {
          name: 'Template1',
          listTemplateId: '1',
          description: 'Description 1',
          isDisabled: false,
          frequency: 'Weekly',
        },
      ],
    });
  });

  it('should return empty templates if no templates found for the switch', async () => {
    const switchUnId = 'testSwitchId';
    const result = { rows: [] };

    jest.spyOn(service, 'getPmTemplates').mockResolvedValue(result);

    await controller.getPmTemplateBySwitch(switchUnId, req, res);

    expect(service.getPmTemplates).toHaveBeenCalledWith(switchUnId);
    expect(res.json).toHaveBeenCalledWith({
      switchUnid: switchUnId,
      templates: [],
    });
  });

  it('should handle errors gracefully when service throws an error', async () => {
    const switchUnId = 'testSwitchId';
    const error = new Error('Service Error');
    jest.spyOn(service, 'getPmTemplates').mockRejectedValue(error);

    await controller.getPmTemplateBySwitch(switchUnId, req, res);

    expect(service.getPmTemplates).toHaveBeenCalledWith(switchUnId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      error: 'Service Error',
    });
  });
});
