import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BuildingEnum, Resources } from '../shared/utils/types';

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
  buildings!: { type: string; level: number }[];

  @Prop({ default: Date.now })
  lastTick!: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
