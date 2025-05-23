import { Resources, ResourceType } from "./resource.types";

export type BuildingType = "farm" | "barracks" | "research";

export enum BuildingEnum {
  FARM = "farm",
  LUMBER_MILL = "lumber_mill",
  MINE = "mine",
  BARRACKS = "barracks",
  RESEARCH = "research",
}

export interface Building {
  type: BuildingType;
  displayName: string;
  cost: BuildingCost;
  buildTime: number; // in minutes
  description?: string;
  level: number;
  upgradeCost: BuildingCost;
  incomeBonus: BuildingIncome;
  upgradeMultiplier: number;
}

export type BuildingCatalog = Record<BuildingEnum, Building>;

export type BuildingCost = Partial<Record<ResourceType, number>>;

export type BuildingIncome = Partial<Record<ResourceType, number>>;

export type BuildingData = {
  cost: BuildingCost;
  incomeBonus: BuildingIncome;
  upgradeMultiplier: number;
};
