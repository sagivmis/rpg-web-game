import { UnitStats, UnitType } from "./units.types";

export type UnitCatalog = Record<UnitType, UnitStats>;
export interface ArmyUnit {
  type: UnitType;
  count: number;
}
export type Army = ArmyUnit[];
