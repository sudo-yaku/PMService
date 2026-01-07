import { Module } from '@nestjs/common';
import { OracleModule } from '../common/database/oracle.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import taskrepo from './task.repo';

@Module({
  imports: [OracleModule],
  controllers: [TaskController],
  providers: [TaskService,taskrepo],
})
export class TaskModule {}
