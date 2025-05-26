// src/common/decorators/role.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Role = (role: 'admin' | 'player') => SetMetadata('role', role);
