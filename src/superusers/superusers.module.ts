import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuperusersService } from './superusers.service';
import { Superuser } from './superuser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Superuser])],
  providers: [SuperusersService],
  exports: [SuperusersService],
  controllers: []
})
export class SuperusersModule { }
