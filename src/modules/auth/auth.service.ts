import { 
    Injectable, 
    ConflictException, 
    UnauthorizedException 
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { PrismaService } from '../../prisma/prisma.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwtService: JwtService
    ) {}
  
    async register(registerDto: RegisterDto) {
      const { email, password, role, fullName, phoneNumber } = registerDto;
  
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email }
      });
  
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          phoneNumber,
          role
        }
      });
  
      // Create role-specific profile
      switch(role) {
        case 'DONOR':
          await this.prisma.donor.create({
            data: { userId: user.id }
          });
          break;
        case 'BURSAR':
          await this.prisma.bursar.create({
            data: { userId: user.id }
          });
          break;
        case 'CHIEF':
          await this.prisma.chief.create({
            data: { userId: user.id }
          });
          break;
      }
  
      return { message: 'Registration successful' };
    }
  
    async login(loginDto: LoginDto) {
      const { email, password } = loginDto;
  
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email }
      });
  
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Generate JWT
      const payload = { 
        sub: user.id, 
        email: user.email, 
        role: user.role 
      };
  
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    }
  }