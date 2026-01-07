import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {Oracle} from './common/database/oracle';
import { OracleLoggingInterceptor } from './common/interceptors/OracleLogging.interceptor';
import {AuthUtil} from './common/utils/AuthUtil/AuthUtil';
import { RestClient } from './common/utils/restClient/restClient.service';
import { HttpService } from '@nestjs/axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');
const httpService = new HttpService();
const restClient = new RestClient(httpService);

const authUtil = new AuthUtil(restClient);
async function bootstrap() {
const app = await NestFactory.create(AppModule);

  await Oracle.init();

  const documentBuilder = new DocumentBuilder()
    .setTitle('IOP PM Service')
    .setDescription('API for IOP PM Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new OracleLoggingInterceptor());

  app.enableCors();

  // Get users list 
  let userListRefreshCount = 0;
  function refreshUserList() {
    if (global.usersList === undefined || global.usersList === null || global.usersList?.length === 0) {
      authUtil.populateUsersInMap();
    } else {
        if (userListRefreshCount % 30 === 0) {
            userListRefreshCount = 0;
            authUtil.populateUsersInMap();
        }
    }
    userListRefreshCount = userListRefreshCount + 1;
}

  await app.listen(config.app.port,function(){
  console.log('Currently running on port: ' + config.app.port);

  authUtil.populateUsersInMap();
  //authUtil.populateBackUpUsersInMap();
  //authUtil.refreshBackUpUsersInMap();

  let value = setInterval(refreshUserList, config.app.userServiceRefreshInterval);
  //let backupUsers = setInterval(authUtil.populateBackUpUsersInMap,config.app.backupUserRefreshInterval);

  });
}
bootstrap();
