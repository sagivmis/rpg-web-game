import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Player } from '../schemas/player.schema';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({
      $or: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) throw new Error('User exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      password: hashed,
    });

    const player = await this.playerModel.create({ user: user._id });

    const token = this.jwtService.sign({ userId: user._id });
    return { token, username: user.username, playerId: player._id };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      $or: [{ username: dto.username }, { email: dto.username }],
    });
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const player = await this.playerModel.findOne({ user: user._id });
    const token = this.jwtService.sign({ userId: user._id });

    if (player) return { token, username: user.username, playerId: player._id };
    else return { '404': 'Not found' };
  }
}
