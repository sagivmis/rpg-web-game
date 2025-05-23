import { BuildingCatalog, BuildingData, BuildingEnum } from "../types";
import { UnitStats, UnitType } from "../types/units.types";

export const BUILDING_CATALOG: BuildingCatalog = {
  [BuildingEnum.FARM]: {
    cost: { food: 100, wood: 50 },
    incomeBonus: { food: 5 },
    upgradeMultiplier: 1.5,
    buildTime: 0,
    displayName: "Farm",
    type: "farm",
    level: 1,
    upgradeCost: { food: 50, wood: 50 },
  },
  [BuildingEnum.LUMBER_MILL]: {
    cost: { wood: 100 },
    incomeBonus: { wood: 5 },
    upgradeMultiplier: 1.4,
    buildTime: 0,
    displayName: "Lumber Mill",
    type: "farm",
    level: 1,
    upgradeCost: { wood: 50 },
  },
  [BuildingEnum.BARRACKS]: {
    cost: { food: 100 },
    incomeBonus: { wood: 5 },
    upgradeMultiplier: 1.4,
    buildTime: 0,
    displayName: "Barracks",
    type: "barracks",
    level: 1,
    upgradeCost: { food: 500 },
  },
  [BuildingEnum.MINE]: {
    cost: { gold: 50, stone: 100 },
    incomeBonus: { gold: 2, stone: 10 },
    upgradeMultiplier: 1.4,
    buildTime: 0,
    displayName: "Mine",
    type: "farm",
    level: 1,
    upgradeCost: { gold: 500, stone: 1000 },
  },
  [BuildingEnum.RESEARCH]: {
    cost: { wood: 100, food: 100, gold: 10, stone: 100 },
    incomeBonus: { wood: 5 },
    upgradeMultiplier: 1.4,
    buildTime: 0,
    displayName: "Research",
    type: "research",
    level: 1,
    upgradeCost: { food: 50, wood: 50 },
  },
};

export const UNIT_CATALOG: Record<UnitType, UnitStats> = {
  [UnitType.INFANTRY]: {
    cost: { food: 50, gold: 10 },
    attack: 5,
    defense: 4,
    speed: 2,
  },
  [UnitType.ARCHER]: {
    cost: { food: 60, wood: 20, gold: 15 },
    attack: 7,
    defense: 2,
    speed: 3,
  },
  [UnitType.CAVALRY]: {
    cost: { food: 120, gold: 40 },
    attack: 10,
    defense: 6,
    speed: 5,
  },
};
