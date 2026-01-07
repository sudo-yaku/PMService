

import { Injectable } from '@nestjs/common';
import { Oracle } from '../common/database/oracle';
import { queries } from './pmMgrSumm.qfactory';

@Injectable()
export default class PmMgrRepo {
    constructor(private oraUtil: Oracle) { }

    async getPmMgrSumm(mgrid: string, duein: string) {
        try {
            const query = queries.getPmMgrSumm;
            const qParams = {
                mgrid: mgrid,
                duein: duein,
            };

            let data: any = await this.oraUtil.executeQuery(query, qParams);

            data = data.rows;
            data = data.map((item) => {
                const lowerCaseItem = {};
                Object.keys(item).forEach((key) => {
                    lowerCaseItem[key.toLowerCase()] = item[key];
                });
                return lowerCaseItem;
            });

            return data;
        } catch (error) {
            throw error;
        }
    }
}

