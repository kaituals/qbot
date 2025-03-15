"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBans = void 0;
const main_1 = require("../main");
const config_1 = require("../config");
const database_1 = require("../database");
const checkBans = async () => {
    try {
        const bannedUsers = await database_1.provider.findBannedUsers();
        bannedUsers.forEach(async (user) => {
            try {
                const member = await main_1.robloxGroup.getMember(Number(user.robloxId));
                if (!member)
                    throw new Error();
                if (member) {
                    await member.kickFromGroup(config_1.config.groupId);
                }
            }
            catch (err) { }
            ;
        });
    }
    catch (err) {
        console.error(err);
    }
    setTimeout(checkBans, 30000);
};
exports.checkBans = checkBans;
