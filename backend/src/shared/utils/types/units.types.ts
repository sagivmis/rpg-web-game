import { ResourceType } from "./resource.types";

export enum UnitType {
  INFANTRY = "infantry",
  ARCHER = "archer",
  CAVALRY = "cavalry",
}

export interface UnitStats {
  cost: Partial<Record<ResourceType, number>>;
  attack: number;
  defense: number;
  speed: number;
}
