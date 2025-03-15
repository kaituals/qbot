"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAuditLogs = void 0;
const main_1 = require("../main");
const handleLogging_1 = require("../handlers/handleLogging");
const config_1 = require("../config");
let lastRecordedDate;
const recordAuditLogs = async () => {
    try {
        const auditLog = await main_1.robloxClient.apis.groupsAPI.getAuditLogs({
            groupId: config_1.config.groupId,
            actionType: 'ChangeRank',
            limit: 10,
            sortOrder: 'Desc',
        });
        const mostRecentDate = new Date(auditLog.data?.[0].created).getTime();
        if (lastRecordedDate) {
            const groupRoles = await main_1.robloxGroup.getRoles();
            auditLog.data.forEach(async (log) => {
                if (main_1.robloxClient.user.id !== log.actor.user.userId) {
                    const logCreationDate = new Date(log.created);
                    if (Math.round(logCreationDate.getTime() / 1000) > Math.round(lastRecordedDate / 1000)) {
                        const oldRole = groupRoles.find((role) => role.id === log.description['OldRoleSetId']);
                        const newRole = groupRoles.find((role) => role.id === log.description['NewRoleSetId']);
                        const target = await main_1.robloxClient.getUser(log.description['TargetId']);
                        (0, handleLogging_1.logAction)('Manual Set Rank', log.actor.user, null, target, `${oldRole.name} (${oldRole.rank}) → ${newRole.name} (${newRole.rank})`);
                    }
                }
            });
            lastRecordedDate = mostRecentDate;
        }
        else {
            lastRecordedDate = mostRecentDate;
        }
    }
    catch (err) {
        console.error(err);
    }
    setTimeout(recordAuditLogs, 60000);
};
exports.recordAuditLogs = recordAuditLogs;
