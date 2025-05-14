import { resourceTypes } from './consts';
import { ResourceType } from '../shared/utils/types';

export const isResourceKey = (key: string): key is ResourceType => {
  return resourceTypes.includes(key as ResourceType);
};
