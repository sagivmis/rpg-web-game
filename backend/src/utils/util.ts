import { resourceTypes } from './consts';
import { ResourceType } from './types';

export const isResourceKey = (key: string): key is ResourceType => {
  return resourceTypes.includes(key as ResourceType);
};
