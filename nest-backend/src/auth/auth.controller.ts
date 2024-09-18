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

    const { accessToken } = await this.authService.googleLogin(req); //  save to cookie
    res.cookie('access_token', accessToken, {
      // httpOnly: true,
    });
    res.redirect(`http://localhost:5173`)
    // return {
    //   message: 'Login Successful',
    // };
  }
  
  @Get('logout')
  async logout(@Request() req, @Res() res: Response) {
    res.clearCookie('jwt token', {
      // httpOnly: true,
    });
    res.redirect(`http://localhost:5173`)
    // return res.json({ message: 'Successfully logged out' });
  }



}