import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true }) username!: string;
  @Prop({ unique: true }) email!: string;
  @Prop() password!: string;
  @Prop({ default: () => Date.now() }) createdAt!: Date;
  @Prop({ default: () => Date.now() }) lastLogin!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
