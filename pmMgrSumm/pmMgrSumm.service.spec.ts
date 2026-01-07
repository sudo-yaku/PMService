import { Test, TestingModule } from '@nestjs/testing';
import { PmMgrSummService } from './pmMgrSumm.service';
import PmMgrRepo from './pmMgrSumm.repo';

describe('PmMgrSummService', () => {
    let service: PmMgrSummService;
    let repo: PmMgrRepo;

    const mockRepo = {
        getPmMgrSumm: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PmMgrSummService,
                {
                    provide: PmMgrRepo,
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<PmMgrSummService>(PmMgrSummService);
        repo = module.get<PmMgrRepo>(PmMgrRepo);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('PmData', () => {
        it('should return transformed data', async () => {
            const mgrid = '123';
            const duein = 'someDueIn';
            const mockData = [
                { techid: 'tech1', numtasks: 10, numtasksdone: 5, duein: '2024-10-10' },
            ];

            mockRepo.getPmMgrSumm.mockResolvedValue(mockData);

            const result = await service.PmData(mgrid, duein);

            expect(result).toEqual({
                taskcounts: [{
                    techid: 'tech1',
                    tasks: [{
                        duein: '2024-10-10',
                        pm: {
                            total: 10,
                            done: 5,
                            perc: 50,
                        },
                    }],
                }],
            });
        });

        it('should handle empty data', async () => {
            const mgrid = '123';
            const duein = 'someDueIn';

            mockRepo.getPmMgrSumm.mockResolvedValue([]);

            const result = await service.PmData(mgrid, duein);

            expect(result).toEqual({ taskcounts: [] });
        });

        it('should throw error if repo fails', async () => {
            const mgrid = '123';
            const duein = 'someDueIn';

            mockRepo.getPmMgrSumm.mockRejectedValue(new Error('Some error'));

            await expect(service.PmData(mgrid, duein)).rejects.toThrow('Some error');
        });
    });
});