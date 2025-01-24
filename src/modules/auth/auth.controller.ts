import { 
    Controller, 
    Post, 
    Body, 
    ValidationPipe, 
    UseGuards, 
    Request 
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('register')
    async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
      return this.authService.register(registerDto);
    }
  
    @Post('login')
    async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('profile')
    async getProfile(@Request() req) {
      // Returns user profile information
      const { password, ...userProfile } = req.user;
      return userProfile;
    }
  }