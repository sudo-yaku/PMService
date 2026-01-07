import { Controller, Param, Get, Query, Req, Res } from '@nestjs/common';
import { PmMgrSummService } from './pmMgrSumm.service';
import { ApiTags } from '@nestjs/swagger';
import logger from '../common/logger/logger';
import { Request, Response } from 'express';

@Controller('ioppm')
@ApiTags('Default')
export class PmMgrSummController {
  constructor(private readonly pmMgrSummService: PmMgrSummService) {}

  // Get PM Summary for Manager details
  @Get('/mgr/:mgrId/pm/summary')
  async getTasksByPm(
    @Param('mgrId') mgrId: string,
    @Query('duein') duein: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    logger.info('Processing request to get PM Summary for Manager.');
    logger.debug('Request parameters:', { mgrId, duein });
    logger.debug('Request headers:', { headers: req.headers });

    try {
      logger.info('Fetching PM data for manager.', { mgrId, duein });
      const pmData = await this.pmMgrSummService.PmData(mgrId, duein);

      logger.debug('Retrieved PM data:', { pmData });

      if (pmData.taskcounts.length === 0) {
        logger.info('No tasks found for the given manager and due-in filter.', { mgrId, duein });
        return res.status(204).send();
      }

      logger.info('Successfully fetched PM Summary for Manager.', { mgrId });
      return res.json(pmData);
    } catch (err) {
      logger.error('Error while fetching PM Summary for Manager.', { errorMessage: err.message, stack: err.stack });
      logger.debug('Error details:', { error: err });
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
}