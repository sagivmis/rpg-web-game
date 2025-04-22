import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Resources } from '../utils/types';

@Schema()
export class Player extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
  user!: Types.ObjectId;

  @Prop({
    type: Object,
    default: { food: 500, wood: 500, stone: 300, gold: 200 },
  })
  resources!: Resources;

  @Prop({ default: Date.now }) lastTick!: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
