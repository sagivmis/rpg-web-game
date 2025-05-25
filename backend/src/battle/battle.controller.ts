import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BattleService } from './battle.service';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post('attack')
  @UseGuards(JwtAuthGuard)
  async attack(@Req() req: any, @Body() body: { targetPlayerId: string }) {
    return this.battleService.attackPlayer(
      req.user.userId,
      body.targetPlayerId,
    );
  }
}
