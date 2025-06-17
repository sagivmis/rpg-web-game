import { IsEnum, IsInt, Min } from 'class-validator';
import { UnitType } from '../../shared/utils/types';

export class RecruitUnitDto {
  @IsEnum(UnitType)
  type!: UnitType;

  @IsInt()
  @Min(1)
  count!: number;
}
