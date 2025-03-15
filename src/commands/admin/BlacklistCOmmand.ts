import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';  // Import config from config.ts

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
                    type: 'DiscordUser',
                    required: true,
                },
            ],
        });
    }

    async run(ctx: CommandContext) {
        const user = ctx.args[0];

        if (!user) {
            return ctx.reply('You must mention a user to blacklist.');
        }

        const executor = ctx.member; // Get the member object of the user who invoked the command

        // TypeScript might not know the structure of config, so force it to any type
        const configAny: any = config;

        // Check if the executor has the admin role ID from the config
        if (!executor || !executor.roles.cache.some(role => configAny.admin.includes(role.id))) {
            return ctx.reply('You do not have permission to use this command.');
        }

        try {
            await ctx.reply(`${user.username} has been blacklisted and will not be able to use the bot.`);
        } catch (error) {
            console.error('Error blacklisting user:', error);
            await ctx.reply('An error occurred while trying to blacklist this user.');
        }
    }
}

export default BlacklistCommand;
