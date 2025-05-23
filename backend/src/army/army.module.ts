import { Module } from '@nestjs/common';
import { ArmyService } from './army.service';
import { ArmyController } from './army.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from '../schemas/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  providers: [ArmyService],
  controllers: [ArmyController],
})
export class ArmyModule {}
