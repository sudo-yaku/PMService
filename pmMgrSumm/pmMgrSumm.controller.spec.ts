import { Test, TestingModule } from '@nestjs/testing';
import { PmMgrSummController } from './pmMgrSumm.controller';
import { PmMgrSummService } from './pmMgrSumm.service';
import { Request, Response } from 'express';

describe('PmMgrSummController', () => {
    let controller: PmMgrSummController;
    let service: PmMgrSummService;

    const mockService = {
        PmData: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PmMgrSummController],
            providers: [{ provide: PmMgrSummService, useValue: mockService }],
        }).compile();

        controller = module.get<PmMgrSummController>(PmMgrSummController);
        service = module.get<PmMgrSummService>(PmMgrSummService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getTasksByPm', () => {
        it('should return task data', async () => {
            const req = {} as Request;
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
            const mgrId = '123';
            const duein = 'someDueIn';
            const pmData = { taskcounts: [{ techid: 'tech1', tasks: [] }] };

            mockService.PmData.mockResolvedValue(pmData);

            await controller.getTasksByPm(mgrId, duein, req, res);

            expect(res.json).toHaveBeenCalledWith(pmData);
            expect(res.status).not.toHaveBeenCalledWith(204);
        });

        it('should return 204 if no task counts', async () => {
            const req = {} as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mgrId = '123';
            const duein = 'someDueIn';
            const pmData = { taskcounts: [] };

            mockService.PmData.mockResolvedValue(pmData);

            await controller.getTasksByPm(mgrId, duein, req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 500 on error', async () => {
            const req = {} as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            const mgrId = '123';
            const duein = 'someDueIn';

            mockService.PmData.mockRejectedValue(new Error('Some error'));

            await controller.getTasksByPm(mgrId, duein, req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Some error", message: "Internal server error" });
        });
    });
});