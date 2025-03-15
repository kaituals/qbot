"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const locale_1 = require("../../handlers/locale");
const config_1 = require("../../config");
const main_1 = require("../../main");
const ms_1 = __importDefault(require("ms"));
const handleLogging_1 = require("../../handlers/handleLogging");
const accountLinks_1 = require("../../handlers/accountLinks");
class RevertRanksCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'revertranks',
            description: 'Reverts all ranking events within the time of the specified duration.',
            type: 'ChatInput',
            module: 'admin',
            args: [
                {
                    trigger: 'duration',
                    description: 'How much time of ranking events would you like to revert?',
                    type: 'String',
                },
                {
                    trigger: 'filter',
                    description: 'Do you want to filter actions to a specific Roblox user?',
                    autocomplete: true,
                    required: false,
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
                    ids: config_1.config.permissions.admin,
                    value: true,
                }
            ]
        });
    }
    async run(ctx) {
        let robloxUser;
        if (ctx.args['filter']) {
            try {
                robloxUser = await main_1.robloxClient.getUser(ctx.args['filter']);
            }
            catch (err) {
                try {
                    const robloxUsers = await main_1.robloxClient.getUsersByUsernames([ctx.args['filter']]);
                    if (robloxUsers.length === 0)
                        throw new Error();
                    robloxUser = robloxUsers[0];
                }
                catch (err) {
                    try {
                        const idQuery = ctx.args['filter'].replace(/[^0-9]/gm, '');
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
        }
        const auditLog = await main_1.robloxClient.apis.groupsAPI.getAuditLogs({
            groupId: main_1.robloxGroup.id,
            actionType: 'ChangeRank',
            limit: 100,
        });
        let duration;
        try {
            duration = Number((0, ms_1.default)(ctx.args['duration']));
            if (!duration)
                throw new Error();
            if (duration < 0.5 * 60000 && duration > 8.64e+7)
                return ctx.reply({ embeds: [(0, locale_1.getInvalidDurationEmbed)()] });
        }
        catch (err) {
            return ctx.reply({ embeds: [(0, locale_1.getInvalidDurationEmbed)()] });
        }
        const maximumDate = new Date();
        maximumDate.setMilliseconds(maximumDate.getMilliseconds() - duration);
        const affectedLogs = auditLog.data.filter((log) => {
            if (log.actor.user.userId === main_1.robloxClient.user.id && !(robloxUser && robloxUser.id === main_1.robloxClient.user.id))
                return;
            if (robloxUser && robloxUser.id !== log.actor.user.userId)
                return;
            const logCreatedDate = new Date(log.created);
            return logCreatedDate > maximumDate;
        });
        affectedLogs.forEach(async (log, index) => {
            setTimeout(async () => {
                await main_1.robloxGroup.updateMember(log.description['TargetId'], log.description['OldRoleSetId']);
            }, index * 1000);
        });
        (0, handleLogging_1.logAction)('Revert Ranks', ctx.user, ctx.args['reason'], null, null, maximumDate);
        return ctx.reply({ embeds: [(0, locale_1.getSuccessfulRevertRanksEmbed)(affectedLogs.length)] });
    }
}
exports.default = RevertRanksCommand;
