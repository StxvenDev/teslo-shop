import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
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
}
