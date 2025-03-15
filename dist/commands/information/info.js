"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const Command_1 = require("../../structures/Command");
const accountLinks_1 = require("../../handlers/accountLinks");
const locale_1 = require("../../handlers/locale");
const database_1 = require("../../database");
class InfoCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'info',
            description: 'Displays information about a group member, and gives you some quick actions.',
            type: 'ChatInput',
            module: 'information',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you want to view the information of?',
                    required: false,
                    type: 'String',
                },
            ]
        });
    }
    async run(ctx) {
        let robloxUser;
        try {
            if (ctx.args['roblox-user']) {
                robloxUser = await main_1.robloxClient.getUser(ctx.args['roblox-user']);
            }
            else {
                robloxUser = await (0, accountLinks_1.getLinkedRobloxUser)(ctx.user.id);
            }
            if (!robloxUser)
                throw new Error();
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
        let robloxMember;
        try {
            robloxMember = await main_1.robloxGroup.getMember(robloxUser.id);
            if (!robloxMember)
                throw new Error();
        }
        catch (err) {
            return ctx.reply({ embeds: [await (0, locale_1.getPartialUserInfoEmbed)(robloxUser, userData)] });
        }
        return ctx.reply({ embeds: [await (0, locale_1.getUserInfoEmbed)(robloxUser, robloxMember, userData)] });
    }
}
exports.default = InfoCommand;
