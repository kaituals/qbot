"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const Command_1 = require("../../structures/Command");
const locale_1 = require("../../handlers/locale");
const config_1 = require("../../config");
class JoinRequestsCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'joinrequests',
            description: 'Gets a list of pending join requests.',
            type: 'ChatInput',
            module: 'join-requests',
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
        const joinRequests = await main_1.robloxGroup.getJoinRequests({});
        return await ctx.reply({ embeds: [(0, locale_1.getJoinRequestsEmbed)(joinRequests.data)] });
    }
}
exports.default = JoinRequestsCommand;
