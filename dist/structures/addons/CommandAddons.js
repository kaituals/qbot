"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandContext = void 0;
const discord_js_1 = require("discord.js");
const locale_1 = require("../../handlers/locale");
const config_1 = require("../../config");
class CommandContext {
    /**
     * Command context for getting usage information and replying.
     *
     * @param payload
     */
    constructor(payload, command, args) {
        this.type = payload instanceof discord_js_1.Message ? 'message' : 'interaction';
        this.subject = payload instanceof discord_js_1.BaseInteraction ? payload : payload;
        this.user = payload instanceof discord_js_1.Message ? payload.author : payload.user;
        this.member = payload.member;
        this.guild = payload.guild;
        this.command = new command();
        this.replied = false;
        this.deferred = false;
        this.args = {};
        if (payload instanceof discord_js_1.BaseInteraction) {
            const interaction = payload;
            interaction.options.data.forEach(async (arg) => {
                this.args[arg.name] = interaction.options.get(arg.name).value;
            });
        }
        else {
            this.subject.channel.sendTyping();
            this.command.args.forEach((arg, index) => { if (!arg.isLegacyFlag)
                this.args[arg.trigger] = args.single(); });
            const filledOutArgs = Object.keys(Object.fromEntries(Object.entries(this.args).filter(([_, v]) => v !== null)));
            const requiredArgs = this.command.args.filter((arg) => (arg.required === undefined || arg.required === null ? true : arg.required) && !arg.isLegacyFlag);
            if (filledOutArgs.length < requiredArgs.length) {
                this.reply({ embeds: [(0, locale_1.getMissingArgumentsEmbed)(this.command.trigger, this.command.args)] });
                throw new Error('INVALID_USAGE');
            }
            else {
                if (args.length > requiredArgs.length) {
                    const extraArgs = args.many(1000, requiredArgs.length);
                    this.args[Object.keys(this.args).filter((key) => !this.command.args.find((arg) => arg.trigger === key).isLegacyFlag).at(-1)] = [this.args[Object.keys(this.args).filter((key) => !this.command.args.find((arg) => arg.trigger === key).isLegacyFlag).at(-1)], ...extraArgs.map((arg) => arg.value)].join(' ');
                }
                let areAllRequiredFlagsEntered = true;
                this.command.args.filter((arg) => arg.isLegacyFlag).forEach((arg) => {
                    const flagValue = args.option(arg.trigger);
                    if (!flagValue && arg.required)
                        areAllRequiredFlagsEntered = false;
                    this.args[arg.trigger] = flagValue;
                });
                if (!areAllRequiredFlagsEntered) {
                    this.reply({ embeds: [(0, locale_1.getMissingArgumentsEmbed)(this.command.trigger, this.command.args)] });
                    throw new Error('INVALID_USAGE');
                }
            }
        }
    }
    checkPermissions() {
        if (!this.command.permissions || this.command.permissions.length === 0) {
            return true;
        }
        else {
            let hasPermission = null;
            let permissions = [];
            this.command.permissions.map((permission) => {
                permission.ids.forEach((id) => {
                    return permissions.push({
                        type: permission.type,
                        id,
                        value: permission.value,
                    });
                });
            });
            const permission = permissions.forEach((permission) => {
                let fitsCriteria;
                if (!hasPermission) {
                    if (config_1.config.permissions.all && this.member.roles.cache.some((role) => config_1.config.permissions.all.includes(role.id))) {
                        fitsCriteria = true;
                    }
                    else {
                        if (permission.type === 'role')
                            fitsCriteria = this.member.roles.cache.has(permission.id);
                        if (permission.type === 'user')
                            fitsCriteria = this.member.id === permission.id;
                    }
                    if (fitsCriteria)
                        hasPermission = true;
                }
            });
            return hasPermission || false;
        }
    }
    /**
     * Send a mesasge in the channel of the command message, or directly reply to a command interaction.
     *
     * @param payload
     */
    async reply(payload) {
        this.replied = true;
        if (this.subject instanceof discord_js_1.CommandInteraction) {
            try {
                const subject = this.subject;
                if (this.deferred) {
                    return await subject.editReply(payload);
                }
                else {
                    return await subject.reply(payload);
                }
            }
            catch (err) {
                const subject = this.subject;
                try {
                    if (this.deferred) {
                        return await subject.editReply(payload);
                    }
                    else {
                        return await subject.reply(payload);
                    }
                }
                catch (err) { }
                ;
            }
        }
        else {
            return await this.subject.channel.send(payload);
        }
    }
    /**
     * Defers a reply.
     */
    async defer() {
        try {
            if (this.subject instanceof discord_js_1.CommandInteraction) {
                const interaction = this.subject;
                if (!interaction.deferred && !interaction.replied)
                    await this.subject.deferReply();
            }
            else {
                await this.subject.channel.sendTyping();
            }
            this.deferred = true;
        }
        catch (err) { }
        ;
    }
}
exports.CommandContext = CommandContext;
