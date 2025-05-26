import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true }) username!: string;
  @Prop({ unique: true }) email!: string;
  @Prop() password!: string;
  @Prop({ default: () => new Date() }) createdAt!: Date;
  @Prop({ default: () => new Date() }) lastLogin!: Date;
  @Prop({ default: 'player', enum: ['player', 'admin'] })
  role!: 'player' | 'admin';
  @Prop({ default: false }) isBanned!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
