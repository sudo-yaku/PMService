var _ = require('lodash');
import { Injectable } from "@nestjs/common";
import { RestClient } from "../restClient/restClient.service";
import logger from "../../logger/logger";
const config = require('config');

@Injectable()
export class AuthUtil{
    constructor(private readonly restClient: RestClient){}
    async populateUsersInMap(){
        var url = config.userService.url + "/all/memory";
        var args = {
            headers : {
                "Accept" : "application/json",
                "Authorization" : config.app.authHeader
            }
        }   
        try{
            const result = await this.restClient.get(url, args.headers).toPromise();
                if(result){
                    global.usersList = result.data.users;
                }else{
                    logger.debug("Received invalid result from user service")
                }
        }catch(error){
           throw error;
        }
      
        };
    
    // async refreshBackUpUsersInMap(){
    //     var url = config.cache.url + "refreshBackups";
    //     var args = {
    //         headers : {
    //             "Accept" : "application/json",
    //             "Authorization" : config.app.authHeader
    //         }
    //     }
    //     try{
    //         const data = await this.restClient.get(url, args.headers).toPromise();
    //             if(!_.isEmpty(data)){
    //                 logger.info('Succesfully refreshed Back up Users List');
    //             }else{
    //                 logger.debug("did not refresh backup user list")
    //             }
    //     }catch(error){
    //         throw error;
    //     }
    //     };
    
    // async populateBackUpUsersInMap(){
    //     var url = config.cache.url + "getbackups?findAll=1";
    //     //var url = "http://98.132.103.58:8042/cache/" +"getbackups?findAll=1"
    //     var args = {
    //         headers : {
    //             "Accept" : "application/json",
    //             "Authorization" : config.app.authHeader
    //         }
    //     }
    //     try{
    //         const data = await this.restClient.post(url, args.headers).toPromise();
    //         if(!_.isEmpty(data)){
    //             global.backupUsersList = data;
    //             logger.info('Succesfully retreived Back up Users List');
    //         }else{
    //              global.backupUsersList={};
    //             logger.debug("Backup User list is empty")
    //         }
    //     }catch(error){
    //         throw error;
    //     } 
    // };
}
   


    
    
    
    

