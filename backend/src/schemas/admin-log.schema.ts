import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AdminLog extends Document {
  @Prop({ required: true })
  action!: string;

  @Prop({ required: true })
  performedBy!: string;

  @Prop({ type: Object })
  details?: any;

  createdAt!: Date;
}

export const AdminLogSchema = SchemaFactory.createForClass(AdminLog);
