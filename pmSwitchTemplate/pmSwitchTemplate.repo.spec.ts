import { Test, TestingModule } from '@nestjs/testing';
import { PmSwitchTemplateRepository } from './PmSwitchTemplate.repo';
import { Oracle } from '../common/database/oracle';
import { queries } from './PmSwitchTemplate.qfactory';

jest.mock('../common/database/oracle');
jest.mock('../common/logger/logger');

describe('PmSwitchTemplateRepository', () => {
  let repository: PmSwitchTemplateRepository;
  let oracleMock: Oracle;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmSwitchTemplateRepository, Oracle],
    }).compile();

    repository = module.get<PmSwitchTemplateRepository>(PmSwitchTemplateRepository);
    oracleMock = module.get<Oracle>(Oracle);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('testFunc', () => {
    it('should return result when query is successful', async () => {
      const switchUnId = 'switch123';
      const mockResult = { rows: [{ TEMPLATE_NAME: 'Template1' }] };

      jest.spyOn(oracleMock, 'executeQuery').mockResolvedValue(mockResult);

      const result = await repository.testFunc(switchUnId);

      expect(oracleMock.executeQuery).toHaveBeenCalledWith(queries.getSwitchPmTemplates, { switchUnId });
      expect(result).toEqual(mockResult);
    });

    it('should throw an error when query fails', async () => {
      const switchUnId = 'switch123';
      const errorMessage = 'Database query failed';

      jest.spyOn(oracleMock, 'executeQuery').mockRejectedValue(new Error(errorMessage));

      try {
        await repository.testFunc(switchUnId);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});