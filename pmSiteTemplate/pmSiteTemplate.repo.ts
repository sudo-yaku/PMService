import { Injectable, Logger } from "@nestjs/common";
import {Oracle}  from "../common/database/oracle";
import { queries} from "./pmSiteTemplate.qfactory";

import logger from '../common/logger/logger';
//let oracleobject = new Oracle();
@Injectable()
export class PmSiteTemplateRepository {
  constructor(private connection: Oracle) {}
  async testFunc(siteUnId){
    try{
    let templatesQuery=queries.getSitePmTemplates;
    const params = [siteUnId]
    let result = await this.connection.executeQuery(templatesQuery,params);
    return result;
    }catch(err){
      logger.error("No templates found",err)
      throw err;
    }
  }
}
