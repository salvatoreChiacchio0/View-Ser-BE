//src/auth/auth.controller.ts

import { Body, Controller, Get, Post,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from 'src/users/DTO/login.dto';
import { UserEntity } from 'src/users/DTO/user.entity';
 
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: "Given email and password check if there is a user" })
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }
  @Get('me')
  @ApiOperation({ summary: "Return the detail about the user in session" })
  @ApiOkResponse({ type: AuthEntity, isArray: true })
  @ApiBearerAuth()
  async findMe(@Request() req : {user:UserEntity}) {
    return req.user
  }
}