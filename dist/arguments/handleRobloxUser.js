"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRobloxUser = void 0;
const accountLinks_1 = require("../handlers/accountLinks");
const main_1 = require("../main");
const handleRobloxUser = async (interaction, option) => {
    if (!option.value)
        return;
    try {
        const discordUsers = await interaction.guild.members.search({
            query: option.value,
            limit: 5,
        });
        const robloxQuery = await main_1.robloxClient.getUsersByUsernames([option.value]);
        const linkedRobloxUsersPromise = new Promise((resolve, reject) => {
            let linkedRobloxUsers = [];
            let userIndex = 0;
            if (discordUsers.size === 0)
                return resolve([]);
            discordUsers.forEach(async (member) => {
                if (userIndex >= 3)
                    return;
                userIndex += 1;
                const linkedRobloxUser = await (0, accountLinks_1.getLinkedRobloxUser)(member.id);
                if (!linkedRobloxUser)
                    return;
                linkedRobloxUsers.push({
                    name: `💬 @${member.user.username}: ${linkedRobloxUser.name} (${linkedRobloxUser.id})`,
                    value: linkedRobloxUser.id.toString(),
                });
                if (userIndex === discordUsers.size)
                    return resolve(linkedRobloxUsers);
            });
        });
        linkedRobloxUsersPromise.then(async (linkedRobloxUsers) => {
            if (robloxQuery.length === 0) {
                if (linkedRobloxUsers.length === 0)
                    return;
                await interaction.respond([
                    ...linkedRobloxUsers
                ]);
            }
            else {
                const robloxUser = await robloxQuery[0].getUser();
                await interaction.respond([
                    {
                        name: `🎮 ${robloxUser.name} (${robloxUser.id})`,
                        value: robloxUser.id.toString(),
                    },
                    ...linkedRobloxUsers
                ]);
            }
        });
    }
    catch (err) { }
    ;
};
exports.handleRobloxUser = handleRobloxUser;
