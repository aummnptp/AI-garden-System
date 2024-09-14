import { Injectable } from "@nestjs/common";
import { PassportModule, PassportStrategy } from "@nestjs/passport";
import { Strategy,Profile  } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            clientID:'63616230434-ujv788k6d1hjjmnoji4lg7emb1nng4m9.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL:'http://localhost:3000/auth/google/redirect',
            scope:['profile','email'],
        })
    }
    async validate(accessToken:string, refreshToken:string, profile:Profile){
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
    }
}