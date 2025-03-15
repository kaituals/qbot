import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';

const blacklistedUsers: string[] = [];  // This array will hold blacklisted user IDs (in-memory)

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

        // Check if the executor has the admin role ID from the config
        const configAny: any = config;

        if (!executor || !executor.roles.cache.some(role => configAny.admin.includes(role.id))) {
            return ctx.reply('You do not have permission to use this command.');
        }

        // Add the user to the blacklist
        if (!blacklistedUsers.includes(user.id)) {
            blacklistedUsers.push(user.id);  // Add the user to the blacklist
            await ctx.reply(`${user.username} has been blacklisted and will not be able to use the bot.`);
        } else {
            await ctx.reply(`${user.username} is already blacklisted.`);
        }
    }
}

export default BlacklistCommand;
