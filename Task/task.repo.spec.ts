import { Test, TestingModule } from '@nestjs/testing';
import  taskrepo from './task.repo';
import { Oracle } from '../common/database/oracle';
import * as commonUtil from '../common/utils/common_util';  // Import the module that exports reformatDates

jest.mock('../common/database/oracle');

jest.mock('../common/utils/common_util', () => ({
  reformatDates: jest.fn(),
}));
describe('taskrepo', () => {
  let repo: taskrepo;
  let oraUtil: Oracle;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [taskrepo, Oracle],
    }).compile();

    repo = module.get<taskrepo>(taskrepo);
    oraUtil = module.get<Oracle>(Oracle);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('pmSData', () => {
    it('should return formatted data when data is fetched successfully', async () => {
      // Mock data
      const mockPmData = {
        rows: [
          {
            META_LASTUPDATEDATE: '2021-01-01',
            STATUSTIMESTAMP: '2021-01-01',
            COMMENTS: null,
            WIDGETID: 123,
            STATUSIDSTAMP: 'user123',
            CFD_HELPTEXT_CONVERTED: '[[LINK:https://example.com]]Example Link[[/LINK]]',
          },
        ],
      };

      const mockHeaderData = {
        rows: [
          {
            headerField1: 'value1',
            headerField2: 'value2',
          },
        ],
      };

      const mockStatusData = {
        rows: [
          { STATUS_ID: 'status1' },
          { STATUS_ID: 'status2' },
        ],
      };

      jest.spyOn(oraUtil, 'executeQuery')
        .mockResolvedValueOnce(mockPmData) // For pmData
        .mockResolvedValueOnce(mockHeaderData) // For headerData1
        .mockResolvedValueOnce(mockStatusData); // For statusData

      // Mock the reformatDates function
      (commonUtil.reformatDates as jest.Mock).mockReturnValue('2021-01-01');

      const result = await repo.pmSData('pmHeaderId');

      // Assertions
      expect(result).toEqual({
        headerData: mockHeaderData.rows,
        pmtasks: [
          {
            META_LASTUPDATEDATE: '2021-01-01',
            STATUSTIMESTAMP: '2021-01-01',
            COMMENTS: '',
            WIDGETID: '123',
            STATUSIDSTAMP: 'user123',
            availablestatuses: ['status1', 'status2'],
            CFD_HELPTEXT_CONVERTED: '<a href="https://example.com" target="_blank" title="Link to \'https://example.com\'">Example Link</a>',
          },
        ],
      });

      expect(oraUtil.executeQuery).toHaveBeenCalledTimes(3);
      expect(oraUtil.executeQuery).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
      expect(commonUtil.reformatDates).toHaveBeenCalledWith('2021-01-01');
    });

    it('should handle empty data gracefully', async () => {
      // Mock empty responses
      const emptyMockData = { rows: [] };
      const mockHeaderData = { rows: [] };
      const mockStatusData = { rows: [] };

      jest.spyOn(oraUtil, 'executeQuery')
        .mockResolvedValueOnce(emptyMockData) // For pmData
        .mockResolvedValueOnce(mockHeaderData) // For headerData1
        .mockResolvedValueOnce(mockStatusData); // For statusData

      const result = await repo.pmSData('pmHeaderId');

      expect(result).toEqual({
        headerData: mockHeaderData.rows,
        pmtasks: [],
      });
    });

    it('should return empty string for COMMENTS if it is null', async () => {
      const mockPmData = {
        rows: [
          {
            COMMENTS: null,
            CFD_HELPTEXT_CONVERTED: '[[LINK:https://example.com]]Example Link[[/LINK]]',
          },
        ],
      };

      const mockHeaderData = { rows: [] };
      const mockStatusData = { rows: [] };

      jest.spyOn(oraUtil, 'executeQuery')
        .mockResolvedValueOnce(mockPmData) // For pmData
        .mockResolvedValueOnce(mockHeaderData) // For headerData1
        .mockResolvedValueOnce(mockStatusData); // For statusData

      const result = await repo.pmSData('pmHeaderId');

      expect(result.pmtasks[0].COMMENTS).toBe('');
    });

    it('should correctly convert CFD_HELPTEXT_CONVERTED to anchor links', async () => {
      const mockPmData = {
        rows: [
          {
            CFD_HELPTEXT_CONVERTED: '[[LINK:https://example.com]]Click here[[/LINK]]',
          },
        ],
      };

      const mockHeaderData = { rows: [] };
      const mockStatusData = { rows: [] };

      jest.spyOn(oraUtil, 'executeQuery')
        .mockResolvedValueOnce(mockPmData) // For pmData
        .mockResolvedValueOnce(mockHeaderData) // For headerData1
        .mockResolvedValueOnce(mockStatusData); // For statusData

      const result = await repo.pmSData('pmHeaderId');

      expect(result.pmtasks[0].CFD_HELPTEXT_CONVERTED).toBe(
        '<a href="https://example.com" target="_blank" title="Link to \'https://example.com\'">Click here</a>'
      );
    });

    it('should handle errors thrown by executeQuery', async () => {
      const errorMessage = 'Database error';
      jest.spyOn(oraUtil, 'executeQuery').mockRejectedValue(new Error(errorMessage));

      await expect(repo.pmSData('pmHeaderId')).rejects.toThrow(errorMessage);
    });
  });

  describe('convertLinksToAnchor', () => {
    it('should convert the links in the helptext to anchor tags', () => {
      const helptext = 'Some text [[LINK:https://example.com]]Click Here[[/LINK]] more text';
      const result = repo['convertLinksToAnchor'](helptext);

      expect(result).toBe(
        'Some text <a href="https://example.com" target="_blank" title="Link to \'https://example.com\'">Click Here</a> more text'
      );
    });

    it('should handle empty helptext', () => {
      const helptext = '';
      const result = repo['convertLinksToAnchor'](helptext);

      expect(result).toBe('');
    });

    it('should handle helptext without links', () => {
      const helptext = 'No links here';
      const result = repo['convertLinksToAnchor'](helptext);

      expect(result).toBe('No links here');
    });

    it('should handle malformed link format gracefully', () => {
      const helptext = 'Some text [[LINK:https://example.comClick Here]] more text';
      const result = repo['convertLinksToAnchor'](helptext);

      expect(result).toBe('Some text [[LINK:https://example.comClick Here]] more text');
    });
  });
});