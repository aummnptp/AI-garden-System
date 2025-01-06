import { Injectable } from "@nestjs/common";
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
  
  async login(user: any) {
    
    const payload = { email: user.email, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new Error('Google login failed: No user information received.');
    }
    const { email, name, picture, googleId } = req.user;
    let user = await this.userRepository.findOneBy({ email });
    if (!user) {
      const newUser = this.userRepository.create({
        email,
        name,
        picture,
        googleId,
      });
      user = await this.userRepository.save(newUser);
    }
    const payload = { email: user.email  ,userId:user.userId };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}