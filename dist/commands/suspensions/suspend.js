"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const Command_1 = require("../../structures/Command");
const locale_1 = require("../../handlers/locale");
const verificationChecks_1 = require("../../handlers/verificationChecks");
const config_1 = require("../../config");
const handleLogging_1 = require("../../handlers/handleLogging");
const accountLinks_1 = require("../../handlers/accountLinks");
const ms_1 = __importDefault(require("ms"));
const database_1 = require("../../database");
class SuspendCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'suspend',
            description: 'Temporarily fires a user.',
            type: 'ChatInput',
            module: 'suspensions',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you want to suspend?',
                    autocomplete: true,
                    type: 'String',
                },
                {
                    trigger: 'duration',
                    description: 'How long should they be suspended for? (Format example: 1d, 3d12h, 3 days)',
                    type: 'String',
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
        let duration;
        try {
            duration = Number((0, ms_1.default)(ctx.args['duration']));
            if (!duration)
                throw new Error();
            if (duration < 0.5 * 60000 && duration > 6.31138519 * (10 ^ 10))
                return ctx.reply({ embeds: [(0, locale_1.getInvalidDurationEmbed)()] });
        }
        catch (err) {
            return ctx.reply({ embeds: [(0, locale_1.getInvalidDurationEmbed)()] });
        }
        const endDate = new Date();
        endDate.setMilliseconds(endDate.getMilliseconds() + duration);
        const groupRoles = await main_1.robloxGroup.getRoles();
        const role = groupRoles.find((role) => role.rank === config_1.config.suspendedRank);
        if (!role) {
            console.error(locale_1.noSuspendedRankLog);
            return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
        }
        if (role.rank > config_1.config.maximumRank || robloxMember.role.rank > config_1.config.maximumRank)
            return ctx.reply({ embeds: [(0, locale_1.getRoleNotFoundEmbed)()] });
        if (config_1.config.verificationChecks) {
            const actionEligibility = await (0, verificationChecks_1.checkActionEligibility)(ctx.user.id, ctx.guild.id, robloxMember, role.rank);
            if (!actionEligibility)
                return ctx.reply({ embeds: [(0, locale_1.getVerificationChecksFailedEmbed)()] });
        }
        const userData = await database_1.provider.findUser(robloxUser.id.toString());
        if (userData.suspendedUntil)
            return ctx.reply({ embeds: [(0, locale_1.getAlreadySuspendedEmbed)()] });
        await database_1.provider.updateUser(robloxUser.id.toString(), { suspendedUntil: endDate, unsuspendRank: robloxMember.role.id });
        try {
            if (robloxMember.role.id !== role.id)
                await main_1.robloxGroup.updateMember(robloxUser.id, role.id);
            ctx.reply({ embeds: [await (0, locale_1.getSuccessfulSuspendEmbed)(robloxUser, role.name, endDate)] });
            (0, handleLogging_1.logAction)('Suspend', ctx.user, ctx.args['reason'], robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`, endDate);
        }
        catch (err) {
            console.error(err);
            return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
        }
    }
}
exports.default = SuspendCommand;
