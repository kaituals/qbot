"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const discord_js_1 = require("discord.js");
const commandTypeMappings = {
    ChatInput: discord_js_1.ApplicationCommandType.ChatInput,
    Message: discord_js_1.ApplicationCommandType.Message,
    User: discord_js_1.ApplicationCommandType.User
};
const argumentTypeMappings = {
    Subcommand: discord_js_1.ApplicationCommandOptionType.Subcommand,
    SubcommandGroup: discord_js_1.ApplicationCommandOptionType.SubcommandGroup,
    String: discord_js_1.ApplicationCommandOptionType.String,
    Number: discord_js_1.ApplicationCommandOptionType.Integer,
    RobloxUser: discord_js_1.ApplicationCommandOptionType.String,
    RobloxRole: discord_js_1.ApplicationCommandOptionType.String,
    DiscordUser: discord_js_1.ApplicationCommandOptionType.User,
    DiscordRole: discord_js_1.ApplicationCommandOptionType.Role,
    DiscordChannel: discord_js_1.ApplicationCommandOptionType.Channel,
    DiscordMentionable: discord_js_1.ApplicationCommandOptionType.Mentionable,
};
const mapArgument = (arg) => {
    // @ts-ignore
    const apiArgument = {
        name: arg.trigger,
        description: arg.description || 'No description provided.',
        type: argumentTypeMappings[arg.type],
        autocomplete: arg.autocomplete || false,
        required: arg.required !== null && arg.required !== undefined ? arg.required : true,
        choices: arg.choices || [],
        options: arg.args ? arg.args.map(mapArgument) : [],
        channelTypes: arg.channelTypes,
    };
    return apiArgument;
};
class Command {
    constructor(options) {
        this.trigger = options.trigger;
        this.type = options.type || 'ChatInput';
        this.description = options.description || '*No description provided.*';
        this.module = options.module || 'other';
        this.aliases = options.aliases || [];
        this.permissions = options.permissions || [];
        this.args = options.args || [];
    }
    /**
     * Generate a command object for slash commands.
     */
    generateAPICommand() {
        if (this.type.startsWith('Subcommand')) {
            return {
                name: this.trigger,
                description: this.description,
                type: commandTypeMappings[this.type],
                options: this.args ? this.args.map(mapArgument) : [],
            };
        }
        else {
            return {
                name: this.trigger,
                description: this.description,
                type: commandTypeMappings[this.type],
                options: this.args ? this.args.map(mapArgument) : [],
                defaultPermission: true,
            };
        }
    }
}
exports.Command = Command;
