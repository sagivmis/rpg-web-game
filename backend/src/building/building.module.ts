import { forwardRef, Module } from '@nestjs/common';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [forwardRef(() => PlayerModule)],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [BuildingService],
})
export class BuildingModule {}
