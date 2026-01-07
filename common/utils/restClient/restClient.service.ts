import { Body, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpService} from '@nestjs/axios';
import logger from '../../logger/logger';
// import logger from 'config/Log.config';

@Injectable()
export class RestClient {
  constructor(
    private httpService: HttpService,
  ) {}
  get(baseURL: any, headers?: any, url?: any,requestConfig?:any,parameters?:any):Observable<any> {
      try{  logger.debug("baseURL:",baseURL)
    const axiosconfig: AxiosRequestConfig = {
      baseURL: baseURL,
      headers: headers,
      timeout:3000,
      params:parameters    
    };
    // logger.debug("return")
    return this.httpService.get(url, axiosconfig);
    } catch (error){
    logger.error("async get err-->", error)
    return error
    }
    } 

    get1(baseURL: any, headers?: any, url?: any,requestConfig?:any,parameters?:any):Observable<any> {
      try{  logger.debug("baseURL:",baseURL)
    const axiosconfig: AxiosRequestConfig = {
      baseURL: baseURL,
      headers: headers,
      params:parameters    
    };
    // logger.debug("return")
    // console.log(baseURL," Testing in HTTP ");
    return this.httpService.get(url, axiosconfig);
    } catch (error){
    logger.error("async get err-->", error)
    return error
    }
    }
  
   post(baseURL: any, headers,data,url?:any): Observable<any> {
    try {
      logger.debug("cache url ",baseURL)
    const axiosconfig: AxiosRequestConfig = {
      baseURL: baseURL,
      headers: headers,
      data:data,
    };
    return  this.httpService.post(`${baseURL}${url}`,data,{headers});
      
    } catch (error) {
       
      logger.error("post ",error)
      return error
      
    }
    
  } 
   
  async update(@Body() data:any,url,headers){
    logger.debug("url => ",url,"data =>",data,"headers",headers)
    try {
        
      const response = await axios.post(url,data,{headers})
      return response.data
      
    } catch (error) {
      return error
      
    }
    
  }
  async put(data:any,url, args){
   logger.debug("url => ",url,"data =>",data,"headers=>",data.headers,args)
    try {
        
      const response = await axios.put(url,data,args);
      logger.debug("response data.........>",response.data); 
      return response.data;
      
    } catch (error) {
      logger.error("error..............>", error.message);
      throw new Error(error);

    }
    
  }

  async upsert(@Body() data:any,url,headers){
    // logger.debug("insertion starts")
    try {
      const response = await axios.post(url,data,{headers})
      // logger.debug("result from cache ",response.data)
      return response?.data
    } catch (error) {
      console.log("Upsert error",error)
      return error
    }
    
  }

}

