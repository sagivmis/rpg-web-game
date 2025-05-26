import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'logs' }) // 👈 force name "logs"
export class Log extends Document {
  @Prop({ required: true })
  message!: string; // e.g. "battle", "error", "auth", etc.

  @Prop({ type: Object })
  context?: any; // flexible data blob

  createdAt!: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
