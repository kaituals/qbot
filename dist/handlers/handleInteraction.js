"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInteraction = void 0;
const main_1 = require("../main");
const CommandAddons_1 = require("../structures/addons/CommandAddons");
const discord_js_1 = require("discord.js");
const handleRobloxUser_1 = require("../arguments/handleRobloxUser");
const handleRobloxRole_1 = require("../arguments/handleRobloxRole");
const locale_1 = require("../handlers/locale");
const handleInteraction = async (payload) => {
    if (payload instanceof discord_js_1.CommandInteraction) {
        const interaction = payload;
        if (!interaction.channel || !interaction.guild)
            return interaction.reply({ embeds: [(0, locale_1.getUnknownCommandMessage)()] });
        const command = main_1.discordClient.commands.find((cmd) => (new cmd()).trigger === interaction.commandName);
        const context = new CommandAddons_1.CommandContext(interaction, command);
        const permission = context.checkPermissions();
        if (!permission) {
            context.reply({ embeds: [(0, locale_1.getNoPermissionEmbed)()] });
        }
        else {
            await context.defer();
            try {
                (new command()).run(context);
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    else if (payload instanceof discord_js_1.AutocompleteInteraction) {
        const interaction = payload;
        if (!interaction.channel || !interaction.guild)
            return;
        const focusedOption = payload.options.getFocused(true);
        const command = await main_1.discordClient.commands.find((cmd) => (new cmd()).trigger === interaction.commandName);
        if (!command)
            return;
        const focusedArg = (new command()).args.find((arg) => arg.trigger === focusedOption.name);
        if (focusedArg.type === 'RobloxUser')
            (0, handleRobloxUser_1.handleRobloxUser)(interaction, focusedOption);
        if (focusedArg.type === 'RobloxRole')
            await (0, handleRobloxRole_1.handleRobloxRole)(interaction, focusedOption);
    }
};
exports.handleInteraction = handleInteraction;
