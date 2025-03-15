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
class PromoteCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'promote',
            description: 'Promotes a user in the Roblox group.',
            type: 'ChatInput',
            module: 'ranking',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you want to promote?',
                    autocomplete: true,
                    type: 'RobloxUser',
                },
                {
                    trigger: 'reason',
                    description: 'If you would like a reason to be supplied in the logs, put it here.',
                    isLegacyFlag: true,
                    required: false,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config_1.config.permissions.ranking,
                    value: true,
                }
            ]
        });
    }
    async run(ctx) {
        let robloxUser;
        try {
            robloxUser = await main_1.robloxClient.getUser(ctx.args['roblox-user']);
        }
        catch (err) {
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
        const currentRoleIndex = groupRoles.findIndex((role) => role.rank === robloxMember.role.rank);
        const role = groupRoles[currentRoleIndex + 1];
        if (!role)
            return ctx.reply({ embeds: [(0, locale_1.getNoRankAboveEmbed)()] });
        if (role.rank > config_1.config.maximumRank || robloxMember.role.rank > config_1.config.maximumRank)
            return ctx.reply({ embeds: [(0, locale_1.getRoleNotFoundEmbed)()] });
        if (config_1.config.verificationChecks) {
            const actionEligibility = await (0, verificationChecks_1.checkActionEligibility)(ctx.user.id, ctx.guild.id, robloxMember, role.rank);
            if (!actionEligibility)
                return ctx.reply({ embeds: [(0, locale_1.getVerificationChecksFailedEmbed)()] });
        }
        const userData = await database_1.provider.findUser(robloxUser.id.toString());
        if (userData.suspendedUntil)
            return ctx.reply({ embeds: [(0, locale_1.getUserSuspendedEmbed)()] });
        try {
            await main_1.robloxGroup.updateMember(robloxUser.id, role.id);
            ctx.reply({ embeds: [await (0, locale_1.getSuccessfulPromotionEmbed)(robloxUser, role.name)] });
            (0, handleLogging_1.logAction)('Promote', ctx.user, ctx.args['reason'], robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
        }
        catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
        }
    }
}
exports.default = PromoteCommand;
