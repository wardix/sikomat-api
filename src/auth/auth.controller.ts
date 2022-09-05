import { Request, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login/superuser')
  loginSuperuser(@Request() req) {
    return this.authService.loginSuperuser(req.user);
  }
}
