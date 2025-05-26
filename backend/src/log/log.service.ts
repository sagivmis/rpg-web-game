import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from '../schemas/log.schema';
import { Model } from 'mongoose';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name)
    private readonly logModel: Model<Log>,
  ) {}

  async log(message: string, context?: any) {
    await this.logModel.create({ message, context });
  }
}
