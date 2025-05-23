import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from '../schemas/player.schema';
import { Model, Types } from 'mongoose';
import { isResourceKey } from '../utils';
import { BuildingType, Resources, ResourceType } from '../shared/utils/types';
import { BuildingService } from '../building/building.service';
import { BUILDING_CATALOG } from '../shared/utils/game/consts';
import { calculateTotalIncome } from '../shared/utils/game';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<Player>,
    private readonly buildingService: BuildingService,
  ) {}

  async getStats(userId: string) {
    const player = await this.playerModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!player) throw new Error('Player not found');

    // const now = new Date();
    // const minutesPassed = Math.floor(
    //   ((now.getTime() - player.lastTick.getTime()) / 60000) * 60,
    // );
    // const TICK_INTERVAL = 1;

    // const ticks = Math.floor(minutesPassed / TICK_INTERVAL);
    // if (minutesPassed >= TICK_INTERVAL) {
    //   const gainPerTick: Resources = { food: 10, wood: 8, stone: 5, gold: 3 };

    //   for (const [key, value] of Object.entries(gainPerTick)) {
    //     if (isResourceKey(key)) {
    //       player.resources[key] += value * ticks;
    //     }
    //   }

    //   player.markModified('resources');
    //   player.lastTick = now;
    //   console.log(player.resources);

    //   await player.save();
    // }

    const income = calculateTotalIncome(player.buildings, BUILDING_CATALOG);

    return {
      resources: player.resources,
      income,
      lastTick: player.lastTick,
      // ticks,
    };
  }

  async getBuildings(userId: string) {
    const player = await this.playerModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!player) throw new Error('Player not found');

    return {
      buildings: player.buildings,
    };
  }

  async constructBuilding(userId: string, type: BuildingType) {
    const player = await this.playerModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!player) throw new Error('Player not found');

    const buildingData = this.buildingService.getBuildingData(type);
    if (!buildingData) throw new Error('Invalid building type');

    // Check if player has enough resources
    for (const [res, cost] of Object.entries(buildingData.cost)) {
      if (isResourceKey(res)) {
        if (player.resources[res] < cost) {
          throw new Error(`Not enough ${res}`);
        }
      }
    }
    // Deduct cost
    for (const [res, cost] of Object.entries(buildingData.cost)) {
      if (isResourceKey(res)) {
        player.resources[res] -= cost;
      }
    }

    player.buildings.push(BUILDING_CATALOG[type]);
    await player.save();

    return {
      player,
      message: `${type} constructed successfully`,
      buildings: player.buildings,
      resources: player.resources,
    };
  }

  async upgradeBuilding(userId: string, type: BuildingType) {
    const player = await this.playerModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!player) throw new Error('Player not found');

    const cleanType = type.replace(/^['"]|['"]$/g, '');
    const building = player.buildings.find((b) => b.type === cleanType);
    if (!building) throw new Error('Building not owned');

    const buildingData = this.buildingService.getBuildingData(type);

    const costMultiplier = Math.pow(
      buildingData.upgradeMultiplier,
      building.level,
    );

    try {
      for (const [res, cost] of Object.entries(buildingData.cost)) {
        if (isResourceKey(res)) {
          const finalCost = Math.floor(cost * costMultiplier);
          if (player.resources[res] < finalCost) {
            throw new Error(`Not enough ${res}`);
          }
        }
      }
      for (const [res, cost] of Object.entries(buildingData.cost)) {
        if (isResourceKey(res)) {
          const finalCost = Math.floor(cost * costMultiplier);
          player.resources[res] -= finalCost;
        }
      }
    } catch (err: any) {
      const cost = await this.getUpgradeCost(userId, type);

      return { message: err.message, cost, resources: player.resources };
    }

    building.level++;
    await player.save();
    return player;
  }

  stripCostZeros(
    obj: Partial<Record<ResourceType, number>>,
  ): Partial<Record<ResourceType, number>> {
    const cost = Object.entries(obj).filter(
      ([resource, val], index) => val !== 0,
    );

    return Object.fromEntries(cost);
  }

  async getUpgradeCost(
    userId: string,
    type: BuildingType,
  ): Promise<Partial<Record<ResourceType, number>>> {
    const player = await this.playerModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!player) throw new Error('Player not found');

    const building = player.buildings.find((b) => b.type === type);
    if (!building) throw new Error('Building not owned');

    const buildingData = this.buildingService.getBuildingData(type);
    const nextLevel = building.level + 1;

    const multiplier = Math.pow(buildingData.upgradeMultiplier, building.level);
    const cost: Record<ResourceType, number> = {
      food: 0,
      gold: 0,
      stone: 0,
      wood: 0,
    };

    for (const [res, baseCost] of Object.entries(buildingData.cost)) {
      cost[res as ResourceType] = Math.floor(baseCost * multiplier);
    }

    return this.stripCostZeros(cost);
  }
}
