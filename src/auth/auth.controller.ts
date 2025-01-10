import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Auth, GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { ApiResponse } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User created', type: User})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }

  @ApiResponse({ status: 200, description: 'User logged', type: User})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @ApiResponse({ status: 200, description: 'User created', type: User})
  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    // @RawHeaders() rawHeaders : string[],
    @GetUser() user : User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // @Req() request: Express.Request,
    @RawHeaders() rawHeaders : string[],
    @GetUser() user: User,
    @GetUser('email') userEmail: string
  ){
    return {
      ok: true,
      user,
      userEmail,
      rawHeaders
    }
  }
  
  // @SetMetadata('roles',['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  PrivateRoute2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  PrivateRoute3(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }
}
