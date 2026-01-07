import { Injectable } from "@nestjs/common";
import { PmSiteTemplateRepository}  from "./pmSiteTemplate.repo";
import logger from "../common/logger/logger";

@Injectable()
export class PmSiteTemplateService {
  constructor(private pmSiteTemplateRepo: PmSiteTemplateRepository ) {}
  async getPmTemplates(siteUnId:string){
    
    try{
      const result = await this.pmSiteTemplateRepo.testFunc(siteUnId);
      return result;
    }catch(err){
      logger.error("Unable to fetch templates",err)
      throw new Error('Service Error: Unable to fetch template')
    };
  };
}
