import { Module } from '@nestjs/common';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from '../schemas/player.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  providers: [BattleService],
  controllers: [BattleController],
})
export class BattleModule {}
