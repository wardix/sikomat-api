import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { SuperusersModule } from '../superusers/superusers.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalSuperuserStrategy } from './strategies/local-superuser.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SuperusersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES}d` }
    })
  ],
  providers: [AuthService, LocalSuperuserStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
