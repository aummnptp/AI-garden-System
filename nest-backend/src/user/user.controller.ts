import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorator/roles-decoraters';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() registerDTO: RegisterDTO) {
    return this.userService.create(registerDTO);
  }




    @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Get('/getUser/:id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  

  @UseGuards(JwtGuard)  
  @Get('profile')    
  async getProfile(@Request() req) {
    // console.log  ("abc",req.user)
    const userId = req.user.userId;
    const user = await this.userService.findOne(userId)
    return user;
    // return this.userService.findAll();
  }

  @Role("admin")
    @UseGuards(JwtGuard, RolesGuard)
  @Patch('promote/:userId') 
  promoteToAdmin(@Param('userId') userId: string) {
    return this.userService.promoteToAdmin(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  
}
