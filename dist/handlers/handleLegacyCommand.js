"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLegacyCommand = void 0;
const main_1 = require("../main");
const config_1 = require("../config");
const CommandAddons_1 = require("../structures/addons/CommandAddons");
const lexure_1 = require("lexure");
const locale_1 = require("../handlers/locale");
const parseCommand = (s) => {
    const lexer = new lexure_1.Lexer(s).setQuotes([['"', '"'], ['“', '”']]);
    const lout = lexer.lexCommand(s => config_1.config.legacyCommands.prefixes.some((prefix) => s.startsWith(prefix)) ? 1 : null);
    if (!lout)
        return null;
    const [command, getTokens] = lout;
    const tokens = getTokens();
    const parser = new lexure_1.Parser(tokens).setUnorderedStrategy((0, lexure_1.prefixedStrategy)(['--', '-', '—'], ['=', ':']));
    const pout = parser.parse();
    return [command.value, new lexure_1.Args(pout)];
};
const handleLegacyCommand = async (message) => {
    if (!config_1.config.legacyCommands.enabled)
        return;
    if (!message.channel || !message.guild)
        return;
    const out = parseCommand(message.content);
    if (!out)
        return;
    const commandQuery = out[0] || null;
    const args = out[1] || null;
    const commandName = commandQuery.replace(/[^a-zA-Z0-9]/, '').replace('-', '');
    const command = main_1.discordClient.commands.find((cmd) => (new cmd()).trigger === commandName || (new cmd()).aliases.includes(commandName));
    if (!command)
        return;
    try {
        const context = new CommandAddons_1.CommandContext(message, command, args);
        if (!context.checkPermissions()) {
            context.reply({ embeds: [(0, locale_1.getNoPermissionEmbed)()] });
        }
        else {
            await context.defer();
            try {
                (new command()).run(context);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    catch (err) {
        return;
    }
};
exports.handleLegacyCommand = handleLegacyCommand;
