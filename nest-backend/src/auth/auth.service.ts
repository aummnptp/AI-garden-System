import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { downloadImage } from "src/common/utils/get-image-profile.util";
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

  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new BadRequestException('Google login failed: No user information received.');
    }
  
    const { email, name, picture, googleId } = req.user;
    let user = await this.userRepository.findOne({ where: { email } });

    const adminEmails = ['64070079@kmitl.ac.th', '64070007@kmitl.ac.th'];


    const urlParts = picture.split('?')[0].split('.');
    const fileExtension = urlParts[urlParts.length - 1] || 'jpg';
    const filename = `${googleId}_${Date.now()}.${fileExtension}`;
    let localPictureUrl: string;
    try {
      localPictureUrl = await downloadImage(picture, filename);
    } catch (error) {
      // กรณีดาวน์โหลดล้มเหลว fallback เป็น URL เดิม
      localPictureUrl = picture;
    }

    if (!user) {
      user = this.userRepository.create({
        email,
        name,
        picture: localPictureUrl, // ใช้ path ของรูปที่ดาวน์โหลดมา
        googleId,
        role: adminEmails.includes(email) ? 'admin' : 'user',
      });
    } else {
      console.log("update user" + user)
      user.name = name;
      user.picture = localPictureUrl;
      user.googleId = googleId;
      if (adminEmails.includes(email)) {
        user.role = 'admin';
      }
    }
  

    user = await this.userRepository.save(user);
  
 
    const payload = { email: user.email, userId: user.userId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}