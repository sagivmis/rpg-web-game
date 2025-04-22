import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/player')
@UseGuards(JwtAuthGuard)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('stats')
  async getStats(@Req() req: any) {
    return this.playerService.getStats(req.user.userId);
  }
}
