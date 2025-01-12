import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends  PassportStrategy(Strategy){
    constructor(configService: ConfigService){
        super({
        //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          jwtFromRequest: ExtractJwt.fromExtractors([
            (request)=>{
                // console.log('Cookies:', request?.cookies); 
                return request?.cookies?.access_token;
            }
        ]),
        secretOrKey: configService.get('JWT_SECRET'), // Use the secret from environment variables
        ignoreExpiration: false,
        })
    }
    async validate(payload: any) {
        // console.log('JWT Payload:', payload); // ตรวจสอบ payload ที่ได้รับจาก JWT
        return { userId: payload.userId, email: payload.email, role: payload.role };
      }

}

