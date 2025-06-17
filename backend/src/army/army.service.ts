import { Injectable } from '@nestjs/common';
import { ResourceType } from '../shared/utils/types';
import { UNIT_CATALOG } from '../shared/utils/game';
import { UnitType } from '../shared/utils/types/units.types';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from '../schemas/player.schema';
import { LogService } from '../log/log.service';

@Injectable()
export class ArmyService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<Player>,
    private readonly logService: LogService,
  ) {}

  async getArmy(userId: string) {
    const player = await this.playerModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!player) throw new Error('Player not found');

    return { army: player.army };
  }
  async recruitUnit(userId: string, type: UnitType, count: number) {
    const countNum = Number(count);
    if (isNaN(countNum) || countNum <= 0) {
      throw new Error('Invalid unit count');
    }

    const player = await this.playerModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!player) throw new Error('Player not found');

    const unit = UNIT_CATALOG[type];
    if (!unit) throw new Error('Invalid unit type');

    // Calculate total cost
    const totalCost = Object.entries(unit.cost).reduce(
      (acc, [res, cost]) => {
        acc[res as ResourceType] = cost * countNum;
        return acc;
      },
      {} as Record<ResourceType, number>,
    );

    // Validate resources
    for (const [res, cost] of Object.entries(totalCost)) {
      if ((player.resources as any)[res] < cost) {
        this.logService.log(
          `recruit unit${countNum > 1 ? 's' : ''} failed, not enough ${res}`,
          {
            userId,
            unitType: type,
            count: countNum,
            resources: player.resources,
            cost: totalCost,
            missingResource: res,
          },
        );
        throw new Error(`Not enough ${res}`);
      }
    }

    this.logService.log(`recruit unit${countNum > 1 ? 's' : ''} successful`, {
      userId,
      unitType: type,
      count: countNum,
      resources: player.resources,
      cost: totalCost,
    });

    // Deduct resources
    for (const [res, cost] of Object.entries(totalCost)) {
      player.resources[res as ResourceType] -= cost;
    }

    // Add or update army
    const existingUnit = player.army.find((u) => u.type === type);
    if (existingUnit) {
      existingUnit.count += countNum;
    } else {
      player.army.push({ type, count: countNum });
    }

    player.markModified('resources');
    player.markModified('army');
    await player.save();

    return player.army;
  }
}
