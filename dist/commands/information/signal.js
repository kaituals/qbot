"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const locale_1 = require("../../handlers/locale");
const api_1 = require("../../api");
const config_1 = require("../../config");
class SignalCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'signal',
            description: 'If configured, this will store a command and make it available through our API.',
            type: 'ChatInput',
            module: 'information',
            args: [
                {
                    trigger: 'signal',
                    description: 'What signal/command would you like to run?',
                    required: false,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config_1.config.permissions.signal,
                    value: true,
                }
            ]
        });
    }
    async run(ctx) {
        (0, api_1.addSignal)(ctx.args['signal']);
        return ctx.reply({ embeds: [(0, locale_1.getSuccessfulSignalEmbed)()] });
    }
}
exports.default = SignalCommand;
