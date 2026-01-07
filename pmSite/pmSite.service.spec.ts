import { Test, TestingModule } from '@nestjs/testing';
import { PmSiteService } from './pmSite.service';
import  PmSiteRepo  from './pmSite.repo';

// Mock the repository
jest.mock('./pmSite.repo');

describe('PmSiteService', () => {
  let pmSiteService: PmSiteService;
  let pmSiteRepo: PmSiteRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmSiteService, PmSiteRepo],
    }).compile();

    pmSiteService = module.get<PmSiteService>(PmSiteService);
    pmSiteRepo = module.get<PmSiteRepo>(PmSiteRepo);
  });

  it('should be defined', () => {
    expect(pmSiteService).toBeDefined();
  });

  it('should call PmSiteRepo and return transformed data', async () => {
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

    jest.spyOn(pmSiteRepo, 'getPmBySite').mockResolvedValue(mockData);

    const result = await pmSiteService.PmData('123');

    expect(result).toEqual({
      pmlist: [
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
      ],
    });
  });

  it('should throw an error if PmSiteRepo fails', async () => {
    const error = new Error('Repository error');
    jest.spyOn(pmSiteRepo, 'getPmBySite').mockRejectedValue(error);

    try {
      await pmSiteService.PmData('123');
    } catch (e) {
      expect(e.message).toBe('Repository error');
    }
  });
});
