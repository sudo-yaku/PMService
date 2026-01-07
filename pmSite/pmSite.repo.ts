import { Injectable } from '@nestjs/common';
import  {Oracle}  from '../common/database/oracle';
import { queries } from './pmSite.qFactory';
import  {reformatDates} from '../common/utils/common_util';


@Injectable()
export default class PmSiteRepo {
  constructor(private oraUtil: Oracle) {}

  async getPmBySite(siteUnid){
    try{
    const query = queries.getPmBySite;
    const qParams = {
      siteUnid: siteUnid,
  };
    let data: any = await this.oraUtil.executeQuery(query, qParams);
      // data = data.rows;

      data = data.rows.map((item) => ({
        ...item,
        STARTDATE: item["STARTDATE"]
          ? reformatDates(item["STARTDATE"])
              :null,
STOPDATE: item["STOPDATE"]
          ? reformatDates(item["STOPDATE"])
              :null,NUMTASKS:item.NUMTASKS==null?0:item.NUMTASKS,NUMTASKSDONE:item.NUMTASKSDONE==null?0:item.NUMTASKSDONE
      }));
      
      
      return data;
    } catch (error) {
      throw error;
    }
}
}

