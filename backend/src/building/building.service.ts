import { Injectable } from '@nestjs/common';
import {
  Building,
  BuildingData,
  BuildingEnum,
  BuildingType,
  ResourceType,
} from '../shared/utils/types';
import { BUILDING_CATALOG } from '../shared/utils/game/consts';

@Injectable()
export class BuildingService {
  private readonly catalog: Record<BuildingEnum, BuildingData> =
    BUILDING_CATALOG;

  getCatalog() {
    return this.catalog;
  }

  getBuildingData(type: BuildingType) {
    return this.catalog[type];
  }
}
