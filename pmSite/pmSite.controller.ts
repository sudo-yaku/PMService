import { Controller, Param, Get, Req, Res } from '@nestjs/common';
import { PmSiteService } from './pmSite.service';
import { ApiTags } from '@nestjs/swagger';
import logger from '../common/logger/logger';
import { Request, Response } from 'express';

const config = require('config');

@Controller('ioppm')
@ApiTags('Default')
export class PmSiteController {
  constructor(private readonly pmSiteService: PmSiteService) {}

  // Getting PM tasks for a specific site
  @Get('/site/:siteUnid/pm')
  async getPmBySite(
    @Param('siteUnid') siteUnid: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    logger.info('Processing request to fetch PM tasks for a specific site.');
    logger.debug('Request parameters:', { siteUnid });
    logger.debug('Request headers:', { headers: req.headers });

    try {
      logger.info('Fetching PM tasks for site.', { siteUnid });
      const data: any = await this.pmSiteService.PmData(siteUnid);
      logger.debug('Retrieved data for site:', { data });

      if (!data || data.length === 0) {
        logger.info('No tasks found for the provided site.', { siteUnid });
        return res.status(204).send();
      }

      logger.info('Successfully fetched PM tasks for the site.', { siteUnid });
      return res.send(data);
    } catch (err) {
      logger.error('Error while fetching PM tasks for the site.', { errorMessage: err.message, stack: err.stack });
      logger.debug('Error details:', { error: err });
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
}