import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() registerDTO: RegisterDTO) {
    return this.userService.create(registerDTO);
  }

  // @UseGuards(JwtGuard)
  // @Get()    
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }


  @UseGuards(JwtGuard)  
  @Get()    
  async  getProfile(@Request() req) {
    console.log  (req)
    const user= await this.userService.findByEmail(req.user.email)
    return user;
    // return this.userService.findAll();
  }

}
