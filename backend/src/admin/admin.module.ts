import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { BattleService } from '../battle/battle.service';
import { Player, PlayerSchema } from '../schemas/player.schema';
import { BattleModule } from '../battle/battle.module';
import { AdminLog, AdminLogSchema } from '../schemas/admin-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminLog.name, schema: AdminLogSchema },
      { name: User.name, schema: UserSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
    BattleModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, BattleService],
})
export class AdminModule {}
