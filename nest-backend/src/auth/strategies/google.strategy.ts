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
            callbackURL:'http://localhost:3000/auth/google/redirect',
            scope:['profile','email'],
        })
    }
    async validate(accessToken:string, refreshToken:string, profile:Profile ,done: VerifyCallback): Promise<any>  {
        const { id, emails, photos } = profile;
        const { givenName, familyName } = profile.name || {};
        const user = {
          googleId: id,
          email: emails[0].value,
          name: `${givenName||``} ${familyName||``}`,
          picture: photos[0].value,
          accessToken,
        };
        done(null, user);
      }
    
}