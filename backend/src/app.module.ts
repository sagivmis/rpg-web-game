// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './schemas/user.schema';
import { Player, PlayerSchema } from './schemas/player.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { BuildingService } from './building/building.service';
import { BuildingController } from './building/building.controller';
import { BuildingModule } from './building/building.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/game',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    PlayerModule,
    BuildingModule,
  ],
  controllers: [AppController, BuildingController],
  providers: [AppService, BuildingService],
})
export class AppModule {}
