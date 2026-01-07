import { Test, TestingModule } from '@nestjs/testing';
import { PmSiteController } from './pmSite.controller';
import { PmSiteService } from './pmSite.service';
import { HttpStatus } from '@nestjs/common';
import { Request,Response } from 'express';

describe('PmSiteController', () => {
  let pmSiteController: PmSiteController;
  let pmSiteService: PmSiteService;
  let res: Response;

  const mockService = {
    PmData: jest.fn(),
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmSiteController],
      providers: [
        {
          provide: PmSiteService,
          useValue: mockService
        },
      ],
    }).compile();

    pmSiteController = module.get<PmSiteController>(PmSiteController);
    pmSiteService = module.get<PmSiteService>(PmSiteService);
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return 204 if no tasks are found for the site', async () => {
    const siteUnid = '1234';
    const mockData: any[] = []; 

    jest.spyOn(pmSiteService, 'PmData').mockResolvedValue(undefined);

    await pmSiteController.getPmBySite(siteUnid, {} as any, res);

    expect(pmSiteService.PmData).toHaveBeenCalledWith(siteUnid);
    expect(res.send).toHaveBeenCalled(); 
  });

  it('should return PM tasks for the site', async () => {
    const siteUnid = '1234';
    const mockData = [
      {
        listname: 'Task 1',
          frequency: 'Monthly',
          switch: 'Switch A',
          site_name: 'Site A',
          site_unid: '123',
          numtasks: 5,
          numtasksdone: 3,
          startdate: '2021-01-01',
          stopdate: '2021-01-31',
          pm_unid: '456',
          pmd_widget_id: '789',
          status: 'Active',
      },
    ];

    // Mock the service method to return the pmTasks
    jest.spyOn(pmSiteService, 'PmData').mockResolvedValue({ pmlist: mockData });

    // Call the controller method
    await pmSiteController.getPmBySite(siteUnid, {} as any, res);

    // Assertions:
    expect(pmSiteService.PmData).toHaveBeenCalledWith(siteUnid);
    expect(res.send).toHaveBeenCalledWith({ pmlist: mockData });
  });
  it('should return 500 on error', async () => {
    const req = {} as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const siteUnid = '123';
    

    mockService.PmData.mockRejectedValue(new Error('Some error'));

    await pmSiteController.getPmBySite(siteUnid,req ,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Some error", message: "Internal server error" });
});


});
