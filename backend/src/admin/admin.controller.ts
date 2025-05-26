import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Army, ResourceType } from '../shared/utils/types';
import { Role } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Role('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async listUsers() {
    return this.adminService.listUsers();
  }

  @Get('user-ids')
  async getUserIds(@Query('count') count?: number) {
    return this.adminService.getUserIds(count);
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Get('user/:id/full')
  async getFullProfile(@Param('id') userId: string) {
    return this.adminService.getFullUserProfile(userId);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Post('user/resources/:id')
  async giveResources(
    @Param('id') id: string,
    @Body() body: Partial<Record<ResourceType, number>>,
  ) {
    return this.adminService.giveResources(id, body);
  }

  @Post('battle')
  async forceBattle(@Body() body: { attackerId: string; defenderId: string }) {
    return this.adminService.forceBattle(body.attackerId, body.defenderId);
  }

  @Post('user/promote/:id')
  async promoteToAdmin(@Param('id') id: string) {
    return this.adminService.promoteToAdmin(id);
  }

  @Post('user/demote/:id')
  async demoteToPlayer(@Param('id') userId: string) {
    return this.adminService.demoteToPlayer(userId);
  }

  @Post('player/:id/wipe')
  async wipePlayer(@Param('id') userId: string) {
    return this.adminService.wipePlayerProgress(userId);
  }

  @Post('user/:id/ban')
  async banUser(@Param('id') userId: string) {
    return this.adminService.toggleUserBan(userId, 'ban');
  }

  @Post('user/:id/unban')
  async unbanUser(@Param('id') userId: string) {
    return this.adminService.toggleUserBan(userId, 'unban');
  }

  @Get('logs')
  async getAdminLogs(@Query('limit') limit = 50) {
    return this.adminService.getAdminLogs(limit);
  }

  @Post('simulate-battle')
  async simulateBattle(@Body() body: { attacker: Army; defender: Army }) {
    return this.adminService.simulateBattle(body.attacker, body.defender);
  }
}
