import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const author = await this.authorRepository.findOne({ where: { username } });
    if (author && (await bcrypt.compare(password, author.password))) {
      const { password, ...result } = author;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return new AuthResponseDto({
      id: user.id,
      name: user.name,
      access_token: this.jwtService.sign(payload),
    });
  }
}
