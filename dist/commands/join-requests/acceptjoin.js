"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const Command_1 = require("../../structures/Command");
const locale_1 = require("../../handlers/locale");
const config_1 = require("../../config");
const handleLogging_1 = require("../../handlers/handleLogging");
const accountLinks_1 = require("../../handlers/accountLinks");
class AcceptJoinCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'acceptjoin',
            description: 'Accepts the join request from a user.',
            type: 'ChatInput',
            module: 'join-requests',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Whose join request do you want to accept?',
                    autocomplete: true,
                    type: 'RobloxUser',
                },
                {
                    trigger: 'reason',
                    description: 'If you would like a reason to be supplied in the logs, put it here.',
                    isLegacyFlag: true,
                    required: false,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config_1.config.permissions.join,
                    value: true,
                }
            ]
        });
    }
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
        const joinRequest = await robloxUser.getJoinRequestInGroup(config_1.config.groupId);
        if (!joinRequest)
            return ctx.reply({ embeds: [(0, locale_1.getNoJoinRequestEmbed)()] });
        try {
            await main_1.robloxGroup.acceptJoinRequest(robloxUser.id);
            ctx.reply({ embeds: [await (0, locale_1.getSuccessfulAcceptJoinRequestEmbed)(robloxUser)] });
            (0, handleLogging_1.logAction)('Accept Join Request', ctx.user, ctx.args['reason'], robloxUser);
        }
        catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
        }
    }
}
exports.default = AcceptJoinCommand;
