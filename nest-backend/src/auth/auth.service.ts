import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

@Injectable()
export class AuthService{
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 

  ) {}
  
  // async login(user: any) {
  //   const payload = { email: user.email, userId: user.userId, role: user.role };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new BadRequestException('Google login failed: No user information received.');
    }
  
    const { email, name, picture, googleId } = req.user;
    let user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      user = this.userRepository.create({
        email,
        name,
        picture,
        googleId,
        role: "user",
      });
    } else {
      user.name = name;
      user.picture = picture;
      user.googleId = googleId;
    }
  

    user = await this.userRepository.save(user);
  
 
    const payload = { email: user.email, userId: user.userId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}