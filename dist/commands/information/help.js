"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const Command_1 = require("../../structures/Command");
const lodash_1 = require("lodash");
const locale_1 = require("../../handlers/locale");
class HelpCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'help',
            description: 'Gets a list of commands to try.',
            type: 'ChatInput',
            module: 'information',
            args: [
                {
                    trigger: 'command-name',
                    description: 'What command would you like to learn more about, if any?',
                    required: false,
                    type: 'String',
                },
            ]
        });
    }
    async run(ctx) {
        const commands = main_1.discordClient.commands.map((cmd) => new (cmd));
        if (ctx.args['command-name']) {
            const command = commands.find((cmd) => cmd.trigger.toLowerCase() === ctx.args['command-name'].toLowerCase() || cmd.aliases.map((alias) => alias.toLowerCase()).includes(ctx.args['command-name'].toLowerCase()));
            if (!command)
                return ctx.reply({ embeds: [(0, locale_1.getCommandNotFoundEmbed)()] });
            return ctx.reply({ embeds: [(0, locale_1.getCommandInfoEmbed)(command)] });
        }
        else {
            const categories = (0, lodash_1.groupBy)(commands, (cmd) => cmd.module);
            return ctx.reply({ embeds: [(0, locale_1.getCommandListEmbed)(categories)] });
        }
    }
}
exports.default = HelpCommand;
