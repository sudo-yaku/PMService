import { Global, Module } from '@nestjs/common';
import {Oracle} from './oracle';
@Global()
@Module({
  providers: [Oracle],
  exports: [Oracle],
})
export class OracleModule {}
