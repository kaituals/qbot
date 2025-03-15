"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const Command_1 = require("../../structures/Command");
const locale_1 = require("../../handlers/locale");
class RolesCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'roles',
            description: 'Displays a list of roles on the group.',
            type: 'ChatInput',
            module: 'information',
        });
    }
    async run(ctx) {
        const roles = await main_1.robloxGroup.getRoles();
        return ctx.reply({ embeds: [(0, locale_1.getRoleListEmbed)(roles)] });
    }
}
exports.default = RolesCommand;
