import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from '../schemas/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  providers: [IncomeService],
})
export class EconomyModule {}
