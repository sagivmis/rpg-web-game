import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { isResourceKey } from '../utils';
import { Army, ResourceType } from '../shared/utils/types';
import { Player } from '../schemas/player.schema';
import { BattleService } from '../battle/battle.service';
import { AdminLog } from '../schemas/admin-log.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(AdminLog.name) private readonly adminLogModel: Model<AdminLog>,
    private readonly battleService: BattleService,
  ) {}

  async logAdminAction(action: string, performedBy: string, details?: any) {
    console.log(`[ADMIN ACTION] ${action} by ${performedBy}`, details || '');
    await this.adminLogModel.create({
      action,
      performedBy,
      details,
    });
  }

  async getFullUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new Error('User not found');

    const player = await this.playerModel.findOne({ user: userId }).lean();
    if (!player) throw new Error('Player not found');

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        isBanned: user.isBanned ?? false,
        createdAt: user.createdAt,
      },
      player: {
        resources: player.resources,
        army: player.army,
        buildings: player.buildings,
        lastTick: player.lastTick,
      },
    };
  }

  async listUsers(): Promise<
    Array<{ userId: string; username: string; role: string; createdAt: Date }>
  > {
    const users = await this.userModel
      .find({}, { _id: 1, username: 1, role: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .lean();

    return users.map((user) => ({
      email: user.email,
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }

  async getUserIds(count?: number): Promise<Record<string, string>> {
    const query = this.userModel
      .find({}, { _id: 1, username: 1 }) // select only _id and username
      .sort({ createdAt: -1 });

    if (count && Number(count) > 0) {
      query.limit(Number(count));
    }

    const users = await query.lean().exec();

    const result: Record<string, string> = {};
    for (const user of users) {
      if (user.username && user._id) {
        result[user.username] = user._id.toString();
      }
    }

    // await this.logAdminAction('GET_USER_', adminId, { to: userId, resources });

    return result;
  }

  async getUserById(id: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new Error('User not found');

    return {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async deleteUser(id: string) {
    const result = await this.userModel.deleteOne({ _id: id });
    return { success: result.deletedCount === 1 };
  }

  async giveResources(
    userId: string,
    resources: Partial<Record<ResourceType, number>>,
  ) {
    const player = await this.playerModel.findOne({ user: userId });
    if (!player) throw new Error('Player not found');

    for (const [res, amount] of Object.entries(resources)) {
      if (isResourceKey(res)) {
        player.resources[res] += amount ?? 0;
      }
    }

    player.markModified('resources');
    await player.save();

    return { updatedResources: player.resources };
  }

  async forceBattle(attackerId: string, defenderId: string) {
    return this.battleService.attackPlayer(attackerId, defenderId);
  }

  async promoteToAdmin(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    user.role = 'admin';
    await user.save();

    await this.logAdminAction('PROMOTE_TO_ADMIN', 'system', {
      userId,
      username: user.username,
    });

    return {
      message: `${user.username} has been promoted to admin`,
      userId,
      role: user.role,
    };
  }

  async demoteToPlayer(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    user.role = 'player';
    await user.save();

    await this.logAdminAction('DEMOTE_TO_PLAYER', 'system', { userId });

    return {
      message: `${user.username} has been demoted to player`,
      userId,
      role: user.role,
    };
  }

  async wipePlayerProgress(userId: string) {
    const player = await this.playerModel.findOne({ user: userId });
    if (!player) throw new Error('Player not found');

    player.resources = {
      food: 500,
      wood: 500,
      stone: 300,
      gold: 200,
    };

    player.army = {};
    player.buildings = [];
    player.lastTick = new Date();

    await player.save();

    await this.logAdminAction('WIPE_PLAYER_PROGRESS', 'system', { userId });

    return {
      message: `Player data wiped for user ${userId}`,
      resetResources: player.resources,
    };
  }

  async toggleUserBan(userId: string, method: 'ban' | 'unban') {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    user.isBanned = method === 'ban';
    await user.save();

    await this.logAdminAction(`${method.toUpperCase()}_USER`, 'system', {
      userId,
    });

    return {
      message: `${user.username} has been ${method}ned.`,
    };
  }

  async getAdminLogs(limit: number) {
    const logs = await this.adminLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return logs.map((log) => ({
      id: log._id.toString(),
      action: log.action,
      performedBy: log.performedBy,
      details: log.details,
      timestamp: log.createdAt,
    }));
  }

  async simulateBattle(attacker: Army, defender: Army) {
    const attackerPower = this.battleService.calculateArmyPower(attacker);
    const defenderPower = this.battleService.calculateArmyPower(defender);

    const result = attackerPower > defenderPower ? 'attacker' : 'defender';

    const casualtyRate = 0.3;

    const finalAttacker = this.battleService.applyCasualties(
      attacker,
      casualtyRate,
    );
    const finalDefender = this.battleService.applyCasualties(
      defender,
      casualtyRate,
    );

    return {
      result,
      attackerPower,
      defenderPower,
      finalAttacker,
      finalDefender,
    };
  }
}
