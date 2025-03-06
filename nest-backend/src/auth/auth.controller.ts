import { Controller, Get, Req, Request, Res, UseGuards } from "@nestjs/common";
// import { Controller, Get, Post,  Request, Res, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { AuthService } from "./auth.service";
import { PassThrough } from "stream";
import { Response } from "express";



@Controller('auth')

export class AuthController {
  constructor(private  readonly authService: AuthService) {}

    @UseGuards(GoogleAuthGuard)
    @Get("google/login")
    async googleAuth(@Req() req: Request & { query: any }, @Res() res: Response) {
      const redirectUrl = (req.query["redirect"] as string) || "/";
      res.cookie("redirect_after_login", redirectUrl, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 10, 
      });
  
      res.end();
    }
  
    @UseGuards(GoogleAuthGuard)
    @Get("google/redirect")
    async googleAuthRedirect(@Req() req: Request & { cookies: any }, @Res() res: Response) {
      const { accessToken } = await this.authService.googleLogin(req);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      const redirectUrl = req.cookies?.["redirect_after_login"] || "/";
      res.clearCookie("redirect_after_login");
  
      const fullRedirectUrl = `${process.env.REACT_APP_API_URL}${redirectUrl}`;  
      return res.redirect(fullRedirectUrl);
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
  @Get('status')
  async getAuthStatus(@Request() req) {
    console.log("Cookies received:", req.cookies);
    return { isAuthenticated: !!req.cookies['access_token'] };
  }

}