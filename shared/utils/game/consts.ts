import { BuildingCatalog, BuildingData, BuildingEnum } from "../types";

export const BUILDING_CATALOG: BuildingCatalog = {
  [BuildingEnum.FARM]: {
    cost: { food: 100, wood: 50 },
    incomeBonus: { food: 5 },
    upgradeMultiplier: 1.5,
  },
  [BuildingEnum.LUMBER_MILL]: {
    cost: { wood: 100 },
    incomeBonus: { wood: 5 },
    upgradeMultiplier: 1.4,
  },
  [BuildingEnum.BARRACKS]: {
    cost: { wood: 100 },
    incomeBonus: { wood: 5 },
    upgradeMultiplier: 1.4,
  },
  [BuildingEnum.MINE]: {
    cost: { wood: 100 },
    incomeBonus: { wood: 5 },
    upgradeMultiplier: 1.4,
  },
  [BuildingEnum.RESEARCH]: {
    cost: { wood: 100 },
    incomeBonus: { wood: 5 },
    upgradeMultiplier: 1.4,
  },
};
