import { robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getUnexpectedErrorEmbed,
    getSuccessfulShoutEmbed,
} from '../../handlers/locale';
import { config } from '../../config';
import { logAction } from '../../handlers/handleLogging';

class ShoutCommand extends Command {
    constructor() {
        super({
            trigger: 'shout',
            description: 'Posts a shout on the Roblox group.',
            type: 'ChatInput',
            module: 'shout',
            args: [
                {
                    trigger: 'content',
                    description: 'What would you like to announce?',
                    required: false,
                    type: 'String',
                },
                {
                    trigger: 'reason',
                    description: 'N/A',
                    isLegacyFlag: true,
                    required: false,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.shout,
                    value: true,
                }
            ]
        });
    }

    async run(ctx: CommandContext) {
        try {
            await robloxGroup.updateShout(ctx.args['content'] || '');
            ctx.reply({ embeds: [ await getSuccessfulShoutEmbed() ]});
            logAction('Shout', ctx.user, ctx.args['reason'], null, null, null, ctx.args['content'] || '*Cleared.*');
        } catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }
    }
}

export default ShoutCommand;