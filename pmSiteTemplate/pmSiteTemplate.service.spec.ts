import { Test, TestingModule } from '@nestjs/testing';
import { PmSiteTemplateService } from './pmSiteTemplate.service';
import { PmSiteTemplateRepository } from './pmSiteTemplate.repo';

jest.mock('./pmSiteTemplate.repo');

describe('PmSiteTemplateService', () => {
  let service: PmSiteTemplateService;
  let repo: PmSiteTemplateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmSiteTemplateService, PmSiteTemplateRepository],
    }).compile();

    service = module.get<PmSiteTemplateService>(PmSiteTemplateService);
    repo = module.get<PmSiteTemplateRepository>(PmSiteTemplateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return PM templates data from repository', async () => {
    const siteUnId = '123';
    const mockData = {
      rows: [
        { TEMPLATE_NAME: 'Template1', LIST_TEMPLATE_ID: '1', TEMPLATE_DESC: 'Desc1', IS_DISABLED: false, FREQUENCY_NAME: 'Monthly' },
      ],
    };
    jest.spyOn(repo, 'testFunc').mockResolvedValue(mockData);

    const result = await service.getPmTemplates(siteUnId);

    expect(result).toEqual(mockData);
  });

  it('should throw an error if repository fails', async () => {
    const error = new Error('Error fetching templates');
    jest.spyOn(repo, 'testFunc').mockRejectedValue(error);

    await expect(service.getPmTemplates('123')).rejects.toThrow('Service Error: Unable to fetch template');
  });
});