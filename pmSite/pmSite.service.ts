import { Injectable } from '@nestjs/common';
import PmSiteRepo from './pmSite.repo';

@Injectable()
export class PmSiteService {
    constructor(private PmSiteRepo: PmSiteRepo) {}

   

    async PmData(siteUnid) {
        try {
            const data = await this.PmSiteRepo.getPmBySite(siteUnid);

            // Convert keys to lowercase and wrap data inside pmlist
            const transformedData = data.map(item => {
                const lowerCaseItem = {};
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        lowerCaseItem[key.toLowerCase()] = item[key];
                    }
                }
                return lowerCaseItem;
            });

            return { pmlist: transformedData };
        } catch (error) {
            throw error;
        }
    }
}
