"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const Command_1 = require("../../structures/Command");
const locale_1 = require("../../handlers/locale");
const verificationChecks_1 = require("../../handlers/verificationChecks");
const config_1 = require("../../config");
const handleLogging_1 = require("../../handlers/handleLogging");
const accountLinks_1 = require("../../handlers/accountLinks");
const database_1 = require("../../database");
const handleXpRankup_1 = require("../../handlers/handleXpRankup");
class XPRankupCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'xprankup',
            description: 'Ranks a user up based on their XP.',
            type: 'ChatInput',
            module: 'xp',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you want to attempt to rankup? This defaults to yourself.',
                    required: false,
                    autocomplete: true,
                    type: 'RobloxUser',
                },
            ]
        });
    }
    async run(ctx) {
        let robloxUser;
        try {
            if (!ctx.args['roblox-user']) {
                robloxUser = await (0, accountLinks_1.getLinkedRobloxUser)(ctx.user.id);
                if (!robloxUser)
                    throw new Error();
            }
            else {
                robloxUser = await main_1.robloxClient.getUser(ctx.args['roblox-user']);
            }
        }
        catch (err) {
            if (!ctx.args['roblox-user'])
                return ctx.reply({ embeds: [(0, locale_1.getInvalidRobloxUserEmbed)()] });
            try {
                const robloxUsers = await main_1.robloxClient.getUsersByUsernames([ctx.args['roblox-user']]);
                if (robloxUsers.length === 0)
                    throw new Error();
                robloxUser = robloxUsers[0];
            }
            catch (err) {
                try {
                    const idQuery = ctx.args['roblox-user'].replace(/[^0-9]/gm, '');
                    const discordUser = await main_1.discordClient.users.fetch(idQuery);
                    const linkedUser = await (0, accountLinks_1.getLinkedRobloxUser)(discordUser.id);
                    if (!linkedUser)
                        throw new Error();
                    robloxUser = linkedUser;
                }
                catch (err) {
                    return ctx.reply({ embeds: [(0, locale_1.getInvalidRobloxUserEmbed)()] });
                }
            }
        }
        let robloxMember;
        try {
            robloxMember = await main_1.robloxGroup.getMember(robloxUser.id);
            if (!robloxMember)
                throw new Error();
        }
        catch (err) {
            return ctx.reply({ embeds: [(0, locale_1.getRobloxUserIsNotMemberEmbed)()] });
        }
        const groupRoles = await main_1.robloxGroup.getRoles();
        const userData = await database_1.provider.findUser(robloxUser.id.toString());
        const role = await (0, handleXpRankup_1.findEligibleRole)(robloxMember, groupRoles, userData.xp);
        if (!role)
            return ctx.reply({ embeds: [(0, locale_1.getNoRankupAvailableEmbed)()] });
        if (ctx.args['roblox-user']) {
            if (!ctx.member.roles.cache.some((role) => config_1.config.permissions.users.includes(role.id)) && (config_1.config.permissions.all ? !ctx.member.roles.cache.some((role) => config_1.config.permissions.all.includes(role.id)) : false)) {
                return ctx.reply({ embeds: [(0, locale_1.getNoPermissionEmbed)()] });
            }
            if (config_1.config.verificationChecks) {
                const actionEligibility = await (0, verificationChecks_1.checkActionEligibility)(ctx.user.id, ctx.guild.id, robloxMember, robloxMember.role.rank);
                if (!actionEligibility)
                    return ctx.reply({ embeds: [(0, locale_1.getVerificationChecksFailedEmbed)()] });
            }
        }
        try {
            await main_1.robloxGroup.updateMember(robloxUser.id, role.id);
            ctx.reply({ embeds: [await (0, locale_1.getSuccessfulXPRankupEmbed)(robloxUser, role.name)] });
            (0, handleLogging_1.logAction)('XP Rankup', ctx.user, null, robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
        }
        catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
        }
    }
}
exports.default = XPRankupCommand;
