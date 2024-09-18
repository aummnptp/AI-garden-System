// import { IsInt, IsNotEmpty } from 'class-validator';
export class RegisterDTO {
    readonly googleId: string;
    readonly email: string;
    readonly name: string;
    readonly picture: string;
}
