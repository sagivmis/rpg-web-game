// shared/game/incomeCalculator.ts
import { Building, BuildingCatalog, ResourceType } from "../types";

export function calculateTotalIncome(
  buildings: Building[],
  catalog: BuildingCatalog
): Record<ResourceType, number> {
  const income: Record<ResourceType, number> = {
    food: 0,
    wood: 0,
    stone: 0,
    gold: 0,
  };

  for (const b of buildings) {
    const data = catalog[b.type];
    const multiplier = Math.pow(b.level, data.upgradeMultiplier);
    for (const [res, amount] of Object.entries(data.incomeBonus)) {
      income[res as ResourceType] += amount * multiplier;
    }
  }

  return income;
}
