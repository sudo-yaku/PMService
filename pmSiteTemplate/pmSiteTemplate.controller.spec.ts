
import { Test, TestingModule } from '@nestjs/testing';
import { PmSiteTemplateController } from './pmSiteTemplate.controller';
import { PmSiteTemplateService } from './pmSiteTemplate.service';
import { Response, Request } from 'express';

jest.mock('./pmSiteTemplate.service');

describe('PmSiteTemplateController', () => {
  let controller: PmSiteTemplateController;
  let service: PmSiteTemplateService;
  let req: Request;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmSiteTemplateController],
      providers: [PmSiteTemplateService],
    }).compile();

    controller = module.get<PmSiteTemplateController>(PmSiteTemplateController);
    service = module.get<PmSiteTemplateService>(PmSiteTemplateService);

    req = { headers: {} } as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return PM templates for a site', async () => {
    const siteUnId = '123';
    const mockData = {
      rows: [
        { TEMPLATE_NAME: 'Template1', LIST_TEMPLATE_ID: '1', TEMPLATE_DESC: 'Desc1', IS_DISABLED: false, FREQUENCY_NAME: 'Monthly' },
        { TEMPLATE_NAME: 'Template2', LIST_TEMPLATE_ID: '2', TEMPLATE_DESC: 'Desc2', IS_DISABLED: false, FREQUENCY_NAME: 'Weekly' },
      ],
    };

    jest.spyOn(service, 'getPmTemplates').mockResolvedValue(mockData);

    await controller.getPmTemplateBySite(siteUnId, req, res);

    expect(res.json).toHaveBeenCalledWith({
      siteUnId,
      templates: [
        { name: 'Template1', listTemplateId: '1', description: 'Desc1', isDisabled: false, frequency: 'Monthly' },
        { name: 'Template2', listTemplateId: '2', description: 'Desc2', isDisabled: false, frequency: 'Weekly' },
      ],
    });
  });

  it('should return empty array if no PM templates found', async () => {
    const siteUnid = '123';
    const mockData = { rows: [] };

    jest.spyOn(service, 'getPmTemplates').mockResolvedValue(mockData);

    await controller.getPmTemplateBySite(siteUnid, req, res);

    expect(res.json).toHaveBeenCalledWith({ siteUnid, templates: [] });
  });

  it('should return internal server error on exception', async () => {
    const siteUnId = '123';
    const error = new Error('Service Error');
    jest.spyOn(service, 'getPmTemplates').mockRejectedValue(error);

    await controller.getPmTemplateBySite(siteUnId, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      error: error.message,
    });
  });
});