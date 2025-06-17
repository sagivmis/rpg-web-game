import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ArmyService } from './army.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UnitType } from '../shared/utils/types/units.types';
import { RecruitUnitDto } from './dto/recruit-unit.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/army')
export class ArmyController {
  constructor(private readonly armyService: ArmyService) {}

  @Post('recruit')
  async recruit(@Req() req: any, @Body() dto: RecruitUnitDto) {
    return this.armyService.recruitUnit(req.user.userId, dto.type, dto.count);
  }

  @Get('')
  async get(@Req() req: any) {
    return this.armyService.getArmy(req.user.userId);
  }
}
