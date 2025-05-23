import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuildingService } from './building.service';
import { PlayerService } from '../player/player.service';
import { BuildingType } from '../shared/utils/types';

@Controller('api/buildings')
@UseGuards(JwtAuthGuard)
export class BuildingController {
  constructor(
    private readonly buildingService: BuildingService,
    private readonly playerService: PlayerService,
  ) {}

  @Get('')
  async getBuildings(@Req() req: any) {
    return this.playerService.getBuildings(req.user.userId);
  }

  @Get('catalog')
  getCatalog() {
    return this.buildingService.getCatalog();
  }

  @Post('construct')
  async construct(@Body() body: { type: BuildingType }, @Req() req: any) {
    return this.playerService.constructBuilding(req.user.userId, body.type);
  }

  @Post('upgrade')
  async upgrade(@Body() body: { type: BuildingType }, @Req() req: any) {
    return this.playerService.upgradeBuilding(req.user.userId, body.type);
  }

  @Get('upgrade-cost')
  async getUpgradeCost(@Req() req: any, @Query('type') type: BuildingType) {
    return this.playerService.getUpgradeCost(req.user.userId, type);
  }
}
