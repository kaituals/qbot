"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const main_1 = require("../../main");
const accountLinks_1 = require("../../handlers/accountLinks");
const database_1 = require("../../database");
const handleLogging_1 = require("../../handlers/handleLogging");
const locale_1 = require("../../handlers/locale");
const config_1 = require("../../config");
class UnGroupBanCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'ungroupban',
            description: 'Unbans someone from the group',
            type: 'ChatInput',
            module: 'admin',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you wish to unban from the group?',
                    autocomplete: true,
                    required: true,
                    type: 'RobloxUser'
                },
                {
                    trigger: 'reason',
                    description: 'If you would like a reason to be supplied in the logs, put it here.',
                    required: false,
                    type: 'String'
                }
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config_1.config.permissions.admin,
                    value: true,
                }
            ]
        });
    }
    ;
    async run(ctx) {
        let robloxUser;
        try {
            robloxUser = await main_1.robloxClient.getUser(ctx.args['roblox-user']);
        }
        catch (err) {
            try {
                const robloxUsers = await main_1.robloxClient.getUsersByUsernames([ctx.args['roblox-user']]);
                if (robloxUsers.length === 0)
                    throw new Error();
                robloxUser = robloxUsers[0];
            }
            catch (err) {
                try {
                    const idQuery = ctx.args['roblox-user'].replace(/[^0-9]/gm, '');
                    const discordUser = await main_1.discordClient.users.fetch(idQuery);
                    const linkedUser = await (0, accountLinks_1.getLinkedRobloxUser)(discordUser.id);
                    if (!linkedUser)
                        throw new Error();
                    robloxUser = linkedUser;
                }
                catch (err) {
                    return ctx.reply({ embeds: [(0, locale_1.getInvalidRobloxUserEmbed)()] });
                }
            }
        }
        const userData = await database_1.provider.findUser(robloxUser.id.toString());
        if (!userData.isBanned)
            return ctx.reply({ embeds: [(0, locale_1.getUserNotBannedEmbed)()] });
        try {
            await database_1.provider.updateUser(robloxUser.id.toString(), {
                isBanned: false
            });
            (0, handleLogging_1.logAction)('Ungroup Ban', ctx.user, ctx.args['reason'], robloxUser);
            return ctx.reply({ embeds: [(0, locale_1.getSuccessfulGroupUnbanEmbed)(robloxUser)] });
        }
        catch (e) {
            console.log(e);
            return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
        }
    }
}
exports.default = UnGroupBanCommand;
