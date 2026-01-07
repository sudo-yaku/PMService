
import { Test, TestingModule } from '@nestjs/testing';
import  PmSiteRepo  from './pmSite.repo';
import { Oracle } from '../common/database/oracle';
import { queries } from './pmSite.qFactory';
import * as commonUtil from '../common/utils/common_util';  // Import the module that exports reformatDates

// Mock the Oracle service
jest.mock('../common/database/oracle');

// Mock the entire common_util module
jest.mock('../common/utils/common_util', () => ({
  reformatDates: jest.fn(),
}));

describe('PmSiteRepo', () => {
  let pmSiteRepo: PmSiteRepo;
  let oraUtil: Oracle;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmSiteRepo, Oracle],
    }).compile();

    pmSiteRepo = module.get<PmSiteRepo>(PmSiteRepo);
    oraUtil = module.get<Oracle>(Oracle);
  });

  it('should be defined', () => {
    expect(pmSiteRepo).toBeDefined();
  });

  it('should return data when getPmBySite is called', async () => {
    const mockData = {
      rows: [
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
        pmd_widget_status: 'Active',
        },
      ],
    };

    // Mock the executeQuery method from Oracle
    jest.spyOn(oraUtil, 'executeQuery').mockResolvedValue(mockData);

    // Mock the reformatDates function to return a fixed date string
    (commonUtil.reformatDates as jest.Mock).mockReturnValue('2021-01-01');

    const result = await pmSiteRepo.getPmBySite('123');
    expect(result).toEqual([
      {
        NUMTASKS: 0,
         NUMTASKSDONE: 0,
         STARTDATE: null,
         STOPDATE: null,
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
        pmd_widget_status: 'Active',
      },
    ]);
  });

  it('should throw an error if there is a problem retrieving data', async () => {
    jest.spyOn(oraUtil, 'executeQuery').mockRejectedValue(new Error('Database error'));

    try {
      await pmSiteRepo.getPmBySite('123');
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });
});