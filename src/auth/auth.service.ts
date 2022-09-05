import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SuperusersService } from '../superusers/superusers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly superusersService: SuperusersService,
    private readonly jwtService: JwtService) { }

  async validateSuperuser(username: string, password: string): Promise<any> {
    const superuser = await this.superusersService.findOne(username);
    if (superuser && superuser.password === password) {
      const { password, ...result } = superuser;
      return result;
    }
    return null;
  }

  async loginSuperuser(user: any) {
    const payload = { username: user.username };
    return {
      token: this.jwtService.sign(payload)
    }
  }
}
