import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Building, BuildingEnum, Resources } from '../shared/utils/types';
import { UnitType } from '../shared/utils/types/units.types';

@Schema()
export class Player extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
  user!: Types.ObjectId;

  @Prop({
    type: Object,
    default: { food: 500, wood: 500, stone: 300, gold: 200 },
  })
  resources!: Resources;

  @Prop({
    type: [
      {
        type: { type: String, enum: BuildingEnum },
        level: { type: Number, default: 1 },
      },
    ],
    default: [], // optional: default to no buildings
  })
  buildings!: Building[];

  @Prop({
    type: [
      {
        type: { type: String, enum: UnitType, required: true },
        count: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  army!: { type: UnitType; count: number }[];

  @Prop({ default: Date.now })
  lastTick!: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
