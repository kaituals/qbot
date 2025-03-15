"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const Command_1 = require("../../structures/Command");
const locale_1 = require("../../handlers/locale");
const config_1 = require("../../config");
const handleLogging_1 = require("../../handlers/handleLogging");
class ShoutCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'shout',
            description: 'Posts a shout on the Roblox group.',
            type: 'ChatInput',
            module: 'shout',
            args: [
                {
                    trigger: 'content',
                    description: 'What should the content of the shout be? If none, the shout will be cleared.',
                    required: false,
                    type: 'String',
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
                    ids: config_1.config.permissions.shout,
                    value: true,
                }
            ]
        });
    }
    async run(ctx) {
        try {
            await main_1.robloxGroup.updateShout(ctx.args['content'] || '');
            ctx.reply({ embeds: [await (0, locale_1.getSuccessfulShoutEmbed)()] });
            (0, handleLogging_1.logAction)('Shout', ctx.user, ctx.args['reason'], null, null, null, ctx.args['content'] || '*Cleared.*');
        }
        catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
        }
    }
}
exports.default = ShoutCommand;
