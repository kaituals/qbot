import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';
import { addToBlacklist } from '../../arguments/blacklistutils';  // Import the utility function

class BlacklistCommand extends Command {
    constructor() {
        super({
            trigger: 'blacklist',
            description: 'Blacklists a user from using the bot regardless of roles.',
            type: 'ChatInput',
            module: 'admin',
            args: [
                {
                    trigger: 'user',
                    description: 'The user to blacklist',
                    type: 'DiscordUser',  // Ensure this is set to DiscordUser type
                    required: true,
                },
            ],
        });
    }

    async run(ctx: CommandContext) {
        // Get the user argument from the context
        const user = ctx.args[0];  // This should be a DiscordUser

        if (!user) {
            return ctx.reply('You must mention a user to blacklist.');
        }

        const executor = ctx.member; // Get the member object of the user who invoked the command

        // Check if the executor has the admin role ID from the config
        const configAny: any = config;

        if (!executor || !executor.roles.cache.some(role => configAny.admin.includes(role.id))) {
            return ctx.reply('You do not have permission to use this command.');
        }

        // Add the mentioned user to the blacklist
        addToBlacklist(user.id);  // Add user to the blacklist with the mentioned user's ID
        await ctx.reply(`${user.username} has been blacklisted and will not be able to use the bot.`);
    }
}

export default BlacklistCommand;
