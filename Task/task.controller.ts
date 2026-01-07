import { Controller, Param, Get, Req, Res } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiTags } from '@nestjs/swagger';
import logger from '../common/logger/logger';
import { Request, Response } from 'express';

const config = require('config');

@Controller('ioppm')
@ApiTags('Default')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // This will return the tasks associated with a PM
  @Get('/pm/:pmHeaderId/tasks')
  async getTasksByPm(
    @Param('pmHeaderId') pmHeaderId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    logger.info('Processing request to fetch tasks for a PM.');
    logger.debug('Request parameters:', { pmHeaderId });
    logger.debug('Request headers:', { headers: req.headers });

    try {
      logger.info('Fetching tasks for PM header.', { pmHeaderId });
      const pmData: any = await this.taskService.PmData(pmHeaderId);
      logger.debug('Retrieved data from service:', { pmData });

      if (pmData.length === 0) {
        logger.info('No tasks found for the PM.', { pmHeaderId });
        return res.status(204).send();
      } else {
        logger.info('Successfully retrieved tasks for the PM.', { pmHeaderId, recordsCount: pmData.length });
        return res.send(pmData);
      }
    } catch (err) {
      logger.error('Error while fetching tasks for PM.', { errorMessage: err.message, stack: err.stack });
      logger.debug('Error details:', { error: err });
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
}