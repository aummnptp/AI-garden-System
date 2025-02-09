import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportModule, PassportStrategy } from "@nestjs/passport";
import { Strategy,Profile, VerifyCallback  } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor(private configService: ConfigService){
        super({
          clientID: configService.get('GOOGLE_CLIENT_ID'),
          clientSecret: configService.get('GOOGLE_SECRET'),
            callbackURL:`${process.env.NEST_APP_API_URL}/auth/google/redirect`,
            scope:['profile','email'],
        })
    }
    
    async validate(accessToken:string, refreshToken:string, profile:Profile ,done: VerifyCallback): Promise<any>  {
      const { id, emails,displayName, photos } = profile;
        const user = {
          googleId: id,
          email: emails[0].value,
          name: displayName,
          picture: photos[0].value,
          accessToken,
        };
        done(null, user);
      }
    
}