import { Global, Injectable, UseInterceptors } from '@nestjs/common';
import { OracleLoggingInterceptor } from '../interceptors/OracleLogging.interceptor';
import  * as oracledb from 'oracledb';
import logger from '../logger/logger';
let config = require('config')
let fs = require('fs')

@Global()
@Injectable()
@UseInterceptors(new OracleLoggingInterceptor())
export class Oracle {
  
  static async init() {
    try {
      logger.debug('Initializing the Db');
      let name = config?.iopdbConfig?.name;
      let env = config?.iopdbConfig?.env;
      let mode = config?.iopdbConfig?.mode;
      let instance = config?.iopdbConfig?.instance;
      let serviceName = config?.iopdbConfig?.serviceName;
      let newConfig = config.iopdbConfig;
      let data = JSON.parse(fs.readFileSync(config?.iopdbConfig?.filePath, 'utf8'));
                    data = data.db;
                    for(let i=0; i<data.length; i++){
                        if(data[i]?.name == name && data[i]?.env == env && data[i]?.mode == mode && data[i]?.instance == instance){
                            let record = data[i];
                            newConfig.user = record?.user;
                            newConfig.password = record?.password;
                            newConfig.host = record?.host;
                            newConfig.port = record?.port;
                            newConfig.dbName = record?.dbName;
                            newConfig.rac_string = record?.rac_string;
                            if (instance == "service" && serviceName) {
                                newConfig.rac_string = record?.rac_string.replace("##SERVICE_NAME", serviceName);
                            } 
                        }
                    }
                    // console.log(" ==> ",newConfig)
      let oracleConfig = { user : newConfig?.user, password : newConfig?.password, connectString : newConfig?.rac_string,poolMin:newConfig?.poolMin,poolMax:newConfig?.poolMax,poolIncrement:newConfig?.poolIncrement};
    
      await oracledb.createPool(oracleConfig);
      await oracledb.getConnection();
    } catch (error) {

    
      logger.error('An error occuered while initializing the db');
      throw error;
    }
  }

  async closeCOnnection() {
    await oracledb.getPool().close(0);
  }
  async executeQuery(query: any, params: any,replace?:any, options?: any,) {
    let connection: any;
    try {
      connection = await oracledb.getConnection();
      for (let key in replace) {
        query = query.replace(key, replace[key]);
      }      
      
      const opt = options
        ? options
        : { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true,maxRows:500000};
       logger.debug("Query =>",query)
       logger.debug("Parameters =>",params)
       logger.debug("options =>",opt)
      const result = await new Promise(async function (resolve, reject) {
        await connection.execute(query, params,opt, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      if (connection) {
        logger.debug("closing connection")
          await connection.close();
      }
      return result;
    } catch (error) {
    
      if(error?.message.includes('ORA-06502') ){
        return []
      }else{
        logger.error('An error occuered while executing query', error);
      throw error;
      }  
    } 
  }
  async executeStream(query: any, params: any, options?: any){
    let rows = [];
    let connection: any;
    try {
      connection = await oracledb.getConnection();
      logger.debug("Query =>",query)
       logger.debug("Parameters =>",params)
       logger.debug("options =>",options)
      const stream = await connection.queryStream( query, params, options);
      stream.on('data', data =>{
        rows.push(data);
      })
      const result = await new Promise(function (resolve, reject) {
        connection.queryStream(query, params,options)
        
      });
      // strea
    } catch (error) {
      logger.error('error in executeStream ',error)      
    }
  }
  async executeManyQuery(query: any, params: any, options?: any) {
    let connection: any;
    try {
      connection = await oracledb.getConnection();
      const opt = options
        ? options
        : { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true,batchErrors: true};
        logger.debug("Query =>",query)
        logger.debug("Parameters =>",params)
        logger.debug("options =>",opt)
      const result = await new Promise(function (resolve, reject) {
        connection.executeMany(query, params,opt, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      return result;
    } catch (error) {
      //logger.error(error,query)
      logger.error('An error occuered while executing query', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          //logger.error('error in closing connection', error)
          logger.error('An error occuered while closing connection', error);
          throw error;
        }
      }
    }
  }

  async executeMergeQuery(query,params,options?:any)
  {
    let connection: any;
    try {
      connection = await oracledb.getConnection();
      const opt = options
        ? options
        : { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true };
        logger.debug("Query =>",query)
        logger.debug("Parameters =>",params)
        logger.debug("options =>",opt)
      const result = await new Promise(function (resolve, reject) {
        connection.execute(query, params,opt, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      return result;
    } catch (error) {
      //logger.error(error,query)
      logger.error('error while executing query', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          logger.error('An error occuered while closing connection', error)
         
          throw error;
        }
      }
    }

  }
  
 async executeProcedure(Query,bindParams,msg){
    let connection: any;
    try {
      connection = await oracledb.getConnection();
        let final_op = {}
        let startsWithresultt = []
        let containsWithresultt = []
        let plsql;
        logger.debug("Query =>",Query)
       logger.debug("Parameters =>",bindParams)
        //connection = await oracledb.getConnection();
        let bindParamss = {}
        if (msg == "site") {
          plsql = `BEGIN search_site_details(
          :p_search_text,
          :p_startwithsite,
          :p_containswithsite
          );
         END;`;
          bindParams = {
            p_search_text: bindParams.search_text,
            p_startwithsite: {
              dir: oracledb.BIND_OUT,
              type: oracledb.CURSOR,
              maxSize: 4000,
            },
            p_containswithsite: {
              dir: oracledb.BIND_OUT,
              type: oracledb.CURSOR,
              maxSize: 4000,
            },
          };
        } else if (msg == "adv") {
          plsql = `BEGIN adv_search_site_details(
            :p_search_text,
            :p_operator,
            :p_key,
            :p_startwithsite,
            :p_containswithsite
            );
           END;`;
          bindParamss = {
            p_search_text: bindParams.search_text,
            p_operator: bindParams.operator,
            p_key: bindParams.key,
            p_startwithsite: {
              dir: oracledb.BIND_OUT,
              type: oracledb.CURSOR,
              maxSize: 4000,
            },
            p_containswithsite: {
              dir: oracledb.BIND_OUT,
              type: oracledb.CURSOR,
              maxSize: 4000,
            },
          };
        } else {
          plsql = `BEGIN search_switch_details(
            :p_search_text,
            :p_startwithsite,
            :p_containswithsite
        );
        END;`;
          bindParams = {
            p_search_text: bindParams.search_text,
            p_startwithsite: {
              dir: oracledb.BIND_OUT,
              type: oracledb.CURSOR,
              maxSize: 4000,
            },
            p_containswithsite: {
              dir: oracledb.BIND_OUT,
              type: oracledb.CURSOR,
              maxSize: 4000,
            },
          };
        }
        logger.debug('bindParamss',bindParamss)
        const result = await connection.execute(plsql,bindParamss,{outFormat:oracledb.OUT_FORMAT_OBJECT});
        
        const startswithresultSet = result.outBinds.p_startwithsite
        const containswithsiteresultSet = result.outBinds.p_containswithsite
        
        let startsrow:any
        while((startsrow = await startswithresultSet.getRow()) )
        {
          startsWithresultt.push(startsrow)
        }
        let containsrow:any
        while((containsrow = await containswithsiteresultSet.getRow()) )
        {
          containsWithresultt.push(containsrow)
        }
        await startswithresultSet.close()
        await containswithsiteresultSet.close()
        
        final_op['starts_with_results'] =startsWithresultt
        final_op['contains_results'] =containsWithresultt
        // console.log('final ',JSON.stringify(final_op))
        return final_op;
        // return 0 ;
    } catch (error) {
      logger.error('error while executing query', error)
        throw error;
    } finally {
        if (connection) {
            try {
               await connection.close()
            } catch (error) {
              logger.error('error in closing connection', error)
            }
        }
    }
    
  }

  
  async executeMktProcedure(Query,bindParams,msg){
    let connection: any;
    try {
      connection = await oracledb.getConnection();
        let final_op = {}
        let startsWithresultt = []
        let containsWithresultt = []
        let plsql;
        logger.debug("Query =>",Query)
       logger.debug("Parameters =>",bindParams)
     //   connection = await oracledb.getConnection();
        if (msg == "site") {
          plsql = `BEGIN search_site_details_mkt(
          :p_search_text,
          :p_mkt,
          :p_startwithsite,
          :p_containswithsite
          );
         END;`;
        }else{
          plsql =  `BEGIN search_switch_details_mkt(
            :p_search_text,
            :p_mkt,
            :p_startwithsite,
            :p_containswithsite
        );
        END;`;
        }
        
        let bindParamss = {
          p_search_text:bindParams.search_text,
          p_mkt:bindParams.mkt,
          p_startwithsite:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR, maxSize: 4000 },
          p_containswithsite:{dir: oracledb.BIND_OUT,type:oracledb.CURSOR, maxSize: 4000}           
        }
        console.log('bindParamss',bindParamss)
        const result = await connection.execute(plsql,bindParamss,{outFormat:oracledb.OUT_FORMAT_OBJECT});
        console.log('result ',result)
        const startswithresultSet = result.outBinds.p_startwithsite
        const containswithsiteresultSet = result.outBinds.p_containswithsite
        
        let startsrow:any
        while((startsrow = await startswithresultSet.getRow()) )
        {
          startsWithresultt.push(startsrow)
        }
        let containsrow:any
        while((containsrow = await containswithsiteresultSet.getRow()) )
        {
          containsWithresultt.push(containsrow)
        }
        await startswithresultSet.close()
        await containswithsiteresultSet.close()
        
        final_op['starts_with_results'] =startsWithresultt
        final_op['contains_results'] =containsWithresultt
        return final_op;
        // return 0 ;
    } catch (error) {
      logger.error('error while executing query', error)
        throw error;
    } finally {
        if (connection) {
            try {
               await connection.close()
            } catch (error) {
              logger.error('error in closing connection', error)
            }
        }
    }
    
  }


}
