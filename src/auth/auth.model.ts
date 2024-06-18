import { Prop } from '@nestjs/mongoose';

export class AuthModel {
  _id: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: string;
}
