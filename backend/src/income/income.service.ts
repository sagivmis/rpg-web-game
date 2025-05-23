import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../schemas/player.schema';
import { calculateTotalIncome, BUILDING_CATALOG } from '../shared/utils/game';
import { isResourceKey } from '../utils';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async applyIncomeToAllPlayers() {
    const players = await this.playerModel.find();

    for (const player of players) {
      const income = calculateTotalIncome(player.buildings, BUILDING_CATALOG);

      for (const [key, value] of Object.entries(income)) {
        if (isResourceKey(key)) {
          player.resources[key] += value;
        }
      }

      player.markModified('resources');
      player.lastTick = new Date();
      await player.save();
    }

    console.log(`[TICK] Income applied to ${players.length} players`);
  }
}
