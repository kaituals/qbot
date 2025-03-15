"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearActions = exports.recordAction = void 0;
const config_1 = require("../config");
const main_1 = require("../main");
const accountLinks_1 = require("./accountLinks");
const handleLogging_1 = require("./handleLogging");
let actionCounts = [];
const recordAction = async (moderator) => {
    if (!config_1.config.antiAbuse.enabled)
        return;
    if (actionCounts[moderator.id]) {
        actionCounts[moderator.id] += 1;
    }
    else {
        actionCounts[moderator.id] = 1;
    }
    if (actionCounts[moderator.id] >= config_1.config.antiAbuse.threshold) {
        try {
            const linkedUser = await (0, accountLinks_1.getLinkedRobloxUser)(moderator.id);
            if (!linkedUser)
                return;
            const groupRoles = await main_1.robloxGroup.getRoles();
            const role = groupRoles.find((role) => role.rank === config_1.config.antiAbuse.demotionRank);
            await main_1.robloxGroup.updateMember(linkedUser.id, role.id);
            (0, handleLogging_1.logAction)('Automatic Demotion', main_1.discordClient.user, '[Automatic] Admin abuse detected.', linkedUser);
        }
        catch (err) { }
        ;
    }
};
exports.recordAction = recordAction;
const clearActions = () => {
    actionCounts = [];
    setTimeout(clearActions, config_1.config.antiAbuse.clearDuration * 1000);
};
exports.clearActions = clearActions;
