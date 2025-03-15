import { discordClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { checkIconUrl, getRoleListEmbed, greenColor, mainColor, quoteIconUrl } from '../../handlers/locale';
import { config } from '../../config';
import { TextChannel } from 'discord.js';

class SessionCommand extends Command {
    constructor() {
        super({
            trigger: 'session',
            description: 'Announces a session in both this server and the group.',
            type: 'ChatInput',
            module: 'sessions',
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.users,
                    value: true,
                }
            ]
        });
    }

    async run(ctx: CommandContext) {
        const channel = await discordClient.channels.fetch('1296468895787516004') as TextChannel;
channel.send({
    embeds: [
        {
            author: {
                name: 'Session Announcement',
            },
            description: '**A Training is now being hosted in our Training Center, come on down for a chance at a promotion! [Join Here](https://www.roblox.com/games/689205547/Training-Center)**'
        }
    ],
    content: '<@&821614899956285440>'
        });
        robloxGroup.updateShout('A session is now being hosted in our Training Center, come on down for a chance at a promotion! https://www.roblox.com/games/689205547/Training-Center');
        return ctx.reply({
            embeds: [
                {
                    author: {
                        name: 'Successfully announced!',
                    },
                    description: '*This has been posted as a group shout and a message in the training announcement channel, should there be any issues please forward them to* `ImKaitlyn#0`!',
                }
            ]
        });
    }
}

export default SessionCommand;