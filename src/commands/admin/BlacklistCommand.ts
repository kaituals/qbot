import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';
import { addToBlacklist } from '../../arguments/blacklistutils';

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
                    type: 'DiscordMentionable',  // Use DiscordMentionable to handle mentions
                    required: true,
                },
            ],
        });
    }

    async run(ctx: CommandContext) {
        const user = ctx.args[0];  // Get the first argument, which should be the mentioned user

        if (!user) {
            return ctx.reply('You must mention a user to blacklist.');
        }

        const executor = ctx.member;

        // Check if the executor has the admin role ID from the config
        const configAny: any = config;

        if (!executor || !executor.roles.cache.some(role => configAny.admin.includes(role.id))) {
            return ctx.reply('You do not have permission to use this command.');
        }

        // Ensure the mentioned user is a valid GuildMember
        try {
            let member;

            // If the mentioned object is a GuildMember or User, we fetch it correctly
            if (user instanceof ctx.guild.members.constructor) {
                member = user; // Already a valid GuildMember, we can use it directly
            } else {
                member = await ctx.guild.members.fetch(user.id);  // Fetch the member using their ID
            }

            if (!member) {
                return ctx.reply('Could not find the mentioned user.');
            }

            // Now safely blacklist the user
            addToBlacklist(member.id);
            await ctx.reply(`${member.user.username} has been blacklisted and will not be able to use the bot.`);
        } catch (error) {
            return ctx.reply('An error occurred while trying to blacklist the user.');
        }
    }
}

export default BlacklistCommand;
