import { Test, TestingModule } from '@nestjs/testing';
import PmMgrRepo from './pmMgrSumm.repo';
import { Oracle } from '../common/database/oracle';

describe('PmMgrRepo', () => {
    let repo: PmMgrRepo;
    let oraUtil: Oracle;

    const mockOracle = {
        executeQuery: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: Oracle, useValue: mockOracle }, PmMgrRepo],
        }).compile();

        repo = module.get<PmMgrRepo>(PmMgrRepo);
        oraUtil = module.get<Oracle>(Oracle);
    });

    it('should be defined', () => {
        expect(repo).toBeDefined();
    });

    describe('getPmMgrSumm', () => {
        it('should return formatted data', async () => {
            const mgrid = '123';
            const duein = 'someDueIn';
            const mockData = {
                rows: [
                    { TECHID: 'tech1', NUMTASKS: 10, NUMTASKSDONE: 5 },
                ],
            };

            mockOracle.executeQuery.mockResolvedValue(mockData);

            const result = await repo.getPmMgrSumm(mgrid, duein);

            expect(result).toEqual([{ techid: 'tech1', numtasks: 10, numtasksdone: 5 }]);
        });

        it('should throw error if query fails', async () => {
            const mgrid = '123';
            const duein = 'someDueIn';

            mockOracle.executeQuery.mockRejectedValue(new Error('Some error'));

            await expect(repo.getPmMgrSumm(mgrid, duein)).rejects.toThrow('Some error');
        });
    });
});