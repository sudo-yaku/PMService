import { DynamicModule, Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { RestClient } from './restClient.service';

@Global()
@Module({
 imports:[HttpModule],
  providers: [RestClient],
  exports: [RestClient],
})
export class RestClientModule {}
