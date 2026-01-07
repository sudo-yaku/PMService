import { Test, TestingModule } from '@nestjs/testing';
import { PmSwitchTemplateService } from './PmSwitchTemplate.service';
import { PmSwitchTemplateRepository } from './PmSwitchTemplate.repo';

jest.mock('./PmSwitchTemplate.repo');

describe('PmSwitchTemplateService', () => {
  let service: PmSwitchTemplateService;
  let repo: PmSwitchTemplateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmSwitchTemplateService, PmSwitchTemplateRepository],
    }).compile();

    service = module.get<PmSwitchTemplateService>(PmSwitchTemplateService);
    repo = module.get<PmSwitchTemplateRepository>(PmSwitchTemplateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPmTemplates', () => {
    it('should return templates when repository provides data', async () => {
      const switchUnId = 'switch123';
      const mockResult = {
        rows: [
          {
            TEMPLATE_NAME: 'Template1',
            LIST_TEMPLATE_ID: '1',
            TEMPLATE_DESC: 'Description 1',
            IS_DISABLED: false,
            FREQUENCY_NAME: 'Daily',
          },
        ],
      };

      jest.spyOn(repo, 'testFunc').mockResolvedValue(mockResult);

      const result = await service.getPmTemplates(switchUnId);

      expect(repo.testFunc).toHaveBeenCalledWith(switchUnId);
      expect(result).toEqual(mockResult);
    });

    it('should throw an error when repository fails', async () => {
      const switchUnId = 'switch123';
      const errorMessage = 'Service Error: Unable to fetch template';

      jest.spyOn(repo, 'testFunc').mockRejectedValue(new Error(errorMessage));

      try {
        await service.getPmTemplates(switchUnId);
      } catch (error) {
        expect(error.message).toBe('Service Error: Unable to fetch template');
      }
    });
  });
});