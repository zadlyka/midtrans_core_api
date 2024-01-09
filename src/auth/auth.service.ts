import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RoleId } from '../role/enums/role-id.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  register(registerDto: RegisterDto) {
    return this.userService.create({ ...registerDto, roleId: RoleId.User });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOneByEmail(email);

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) throw new UnauthorizedException();

    return this.generateToken(user.id);
  }

  async generateToken(userId: string) {
    const user = await this.userService.findOne(userId);
    const payload = { sub: user.id, ...user };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('jwt.refreshTtl'),
    });

    return { accessToken, refreshToken };
  }
}
