import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ArmyService } from './army.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UnitType } from '../shared/utils/types/units.types';

@UseGuards(JwtAuthGuard)
@Controller('api/army')
export class ArmyController {
  constructor(private readonly armyService: ArmyService) {}

  @Post('recruit')
  async recruit(
    @Req() req: any,
    @Body() body: { type: UnitType; count: number },
  ) {
    return this.armyService.recruitUnit(req.user.userId, body.type, body.count);
  }
}
