import { Injectable } from '@nestjs/common';
import { UNIT_CATALOG } from '../shared/utils/game';
import { Army, UnitCatalog } from '../shared/utils/types';
import { Model } from 'mongoose';
import { Player } from '../schemas/player.schema';
import { InjectModel } from '@nestjs/mongoose';
import { isResourceKey, isUnitKey } from '../utils';

@Injectable()
export class BattleService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
  ) {}
  async attackPlayer(attackerId: string, targetId: string) {
    const attacker = await this.playerModel.findOne({ user: attackerId });
    const defender = await this.playerModel.findOne({ user: targetId });
    if (!attacker || !defender)
      throw new Error('Attacker or defender not found');

    const attackerPower = this.calculateArmyPower(attacker.army);
    const defenderPower = this.calculateArmyPower(defender.army);

    const result = attackerPower > defenderPower ? 'attacker' : 'defender';

    // Casualty logic
    const casualtyRate = 0.3; // simple: 30% of units lost
    attacker.army = this.applyCasualties(attacker.army, casualtyRate);
    defender.army = this.applyCasualties(defender.army, casualtyRate);

    // Loot logic
    let loot: Partial<typeof defender.resources> = {};
    if (result === 'attacker') {
      for (const res of Object.keys(defender.resources)) {
        if (isResourceKey(res)) {
          const stolen = Math.floor(defender.resources[res] * 0.25);
          loot[res] = stolen;
          defender.resources[res] -= stolen;
          attacker.resources[res] += stolen;
        }
      }
    }

    attacker.markModified('army');
    attacker.markModified('resources');
    defender.markModified('army');
    defender.markModified('resources');
    await attacker.save();
    await defender.save();

    return {
      result,
      attackerPower,
      defenderPower,
      loot,
    };
  }

  calculateArmyPower(army: Army) {
    let power = 0;

    const armyEntries = Object.entries(army);
    for (const [unit, count] of armyEntries) {
      if (isUnitKey(unit)) {
        const stats = UNIT_CATALOG[unit];
        power += stats.attack * count;
      }
    }
    return power;
  }

  applyCasualties(army: Army, rate: number): Army {
    const newArmy: Army = {};

    for (const [unit, count] of Object.entries(army)) {
      if (isUnitKey(unit)) {
        newArmy[unit] = Math.max(0, Math.floor(count * (1 - rate)));
      }
    }

    return newArmy;
  }
}
