"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSuspensions = void 0;
const database_1 = require("../database");
const main_1 = require("../main");
const config_1 = require("../config");
const checkSuspensions = async () => {
    const suspensions = await database_1.provider.findSuspendedUsers();
    suspensions.forEach(async (suspension) => {
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(suspension.robloxId));
            const groupRoles = await main_1.robloxGroup.getRoles();
            const role = groupRoles.find((role) => role.rank === config_1.config.suspendedRank);
            if (robloxMember.role.rank !== config_1.config.suspendedRank)
                await main_1.robloxGroup.updateMember(robloxMember.id, role.id);
            if (!suspension.suspendedUntil)
                return;
            if (suspension.suspendedUntil.getTime() < new Date().getTime()) {
                await database_1.provider.updateUser(suspension.robloxId, { suspendedUntil: null, unsuspendRank: null });
                const unsuspendRole = groupRoles.find((role) => role.id === suspension.unsuspendRank);
                if (unsuspendRole.rank === config_1.config.suspendedRank)
                    return;
                await main_1.robloxGroup.updateMember(robloxMember.id, unsuspendRole.id);
            }
        }
        catch (err) {
            console.error(err);
        }
    });
    setTimeout(checkSuspensions, 15000);
};
exports.checkSuspensions = checkSuspensions;
