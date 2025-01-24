import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    MinLength, 
    IsEnum, 
    IsOptional 
  } from 'class-validator';
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    DONOR = 'DONOR',
    BURSAR = 'BURSAR',
    CHIEF = 'CHIEF'
  }
  
  export class RegisterDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Full name is required' })
    fullName: string;
  
    @IsOptional()
    @IsString()
    phoneNumber?: string;
  
    @IsEnum(UserRole, { message: 'Invalid user role' })
    role: UserRole;
  }