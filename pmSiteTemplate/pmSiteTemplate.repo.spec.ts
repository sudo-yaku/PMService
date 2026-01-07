import { Test, TestingModule } from '@nestjs/testing';
import { PmSiteTemplateRepository } from './pmSiteTemplate.repo';
import { Oracle } from '../common/database/oracle';

jest.mock('../common/database/oracle');

describe('PmSiteTemplateRepository', () => {
  let repo: PmSiteTemplateRepository;
  let connection: Oracle;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmSiteTemplateRepository, Oracle],
    }).compile();

    repo = module.get<PmSiteTemplateRepository>(PmSiteTemplateRepository);
    connection = module.get<Oracle>(Oracle);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('should fetch PM templates data from database', async () => {
    const mockData = {
      rows: [
        { TEMPLATE_NAME: 'Template1', LIST_TEMPLATE_ID: '1', TEMPLATE_DESC: 'Desc1', IS_DISABLED: false, FREQUENCY_NAME: 'Monthly' },
      ],
    };

    jest.spyOn(connection, 'executeQuery').mockResolvedValue(mockData);

    const result = await repo.testFunc('123');

    expect(result).toEqual(mockData);
  });

  it('should throw an error if database query fails', async () => {
    const error = new Error('Database query failed');
    jest.spyOn(connection, 'executeQuery').mockRejectedValue(error);

    await expect(repo.testFunc('123')).rejects.toThrow(error);
  });
});