import { resourceTypes, unitTypes } from './consts';
import { ResourceType, UnitType } from '../shared/utils/types';

export const isResourceKey = (key: string): key is ResourceType => {
  return resourceTypes.includes(key as ResourceType);
};

export const isUnitKey = (key: string): key is UnitType => {
  return unitTypes.includes(key as UnitType);
};
