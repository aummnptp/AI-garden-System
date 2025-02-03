import { Controller, Get, Post,  Request, Res, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { AuthService } from "./auth.service";
import { PassThrough } from "stream";
import { Response } from "express";

@Controller('auth')
export class AuthController{
    constructor(private  readonly authService: AuthService) {}


    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    async googleAuth(@Request() req) {
        // Initiates the Google OAuth process
      }

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleAuthRedirect(@Request() req, @Res({ passthrough: true }) res: Response) {

    const { accessToken, user } = await this.authService.googleLogin(req); 

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.redirect(`${process.env.REACT_APP_API_URL}`)
 
  }
  
  
  @Get('logout')
  async logout(@Request() req, @Res() res: Response) {
    res.clearCookie('access_token', {  
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  
    res.status(200).json({ message: "Successfully logged out" });
  }



}