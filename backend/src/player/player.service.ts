import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from '../schemas/player.schema';
import { Model, Types } from 'mongoose';
import { isResourceKey, Resources } from '../utils';

@Injectable()
export class PlayerService {
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {}

  async getStats(userId: string) {
    const player = await this.playerModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!player) throw new Error('Player not found');

    const now = new Date();
    const minutesPassed = Math.floor(
      (now.getTime() - player.lastTick.getTime()) / 60000,
    );
    const TICK_INTERVAL = 5;

    if (minutesPassed >= TICK_INTERVAL) {
      const ticks = Math.floor(minutesPassed / TICK_INTERVAL);
      const gainPerTick: Resources = { food: 10, wood: 8, stone: 5, gold: 3 };

      for (const [key, value] of Object.entries(gainPerTick)) {
        if (isResourceKey(key)) {
          player.resources[key] += value * ticks;
        }
      }

      player.lastTick = now;
      await player.save();
    }

    return {
      resources: player.resources,
      lastTick: player.lastTick,
    };
  }
}
