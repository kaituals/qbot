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
class AddXPCommand extends Command_1.Command {
    constructor() {
        super({
            trigger: 'addxp',
            description: 'Adds XP to a user.',
            type: 'ChatInput',
            module: 'xp',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you want to add XP to?',
                    autocomplete: true,
                    type: 'RobloxUser',
                },
                {
                    trigger: 'increment',
                    description: 'How much XP would you like to add?',
                    type: 'Number',
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
                    ids: config_1.config.permissions.users,
                    value: true,
                }
            ]
        });
    }
    async run(ctx) {
        let enoughForRankUp;
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
        if (!Number.isInteger(Number(ctx.args['increment'])) || Number(ctx.args['increment']) < 0)
            return ctx.reply({ embeds: [(0, locale_1.getInvalidXPEmbed)()] });
        if (config_1.config.verificationChecks) {
            const actionEligibility = await (0, verificationChecks_1.checkActionEligibility)(ctx.user.id, ctx.guild.id, robloxMember, robloxMember.role.rank);
            if (!actionEligibility)
                return ctx.reply({ embeds: [(0, locale_1.getVerificationChecksFailedEmbed)()] });
        }
        const userData = await database_1.provider.findUser(robloxUser.id.toString());
        const xp = Number(userData.xp) + Number(ctx.args['increment']);
        await database_1.provider.updateUser(robloxUser.id.toString(), { xp });
        const groupRoles = await main_1.robloxGroup.getRoles();
        const role = await (0, handleXpRankup_1.findEligibleRole)(robloxMember, groupRoles, xp);
        if (role) {
            enoughForRankUp = true;
            try {
                await main_1.robloxGroup.updateMember(robloxUser.id, role.id);
                ctx.reply({ embeds: [await (0, locale_1.getSuccessfulAddingAndRankupEmbed)(robloxUser, role.name, xp.toString())] });
                (0, handleLogging_1.logAction)('XP Rankup', ctx.user, null, robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
            }
            catch (err) {
                console.log(err);
                return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
            }
        }
        else {
            ctx.reply({ embeds: [await (0, locale_1.getSuccessfulXPChangeEmbed)(robloxUser, xp)] });
        }
        try {
            (0, handleLogging_1.logAction)('Add XP', ctx.user, ctx.args['reason'], robloxUser, null, null, null, `${userData.xp} → ${xp} (+${Number(ctx.args['increment'])})`);
        }
        catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [(0, locale_1.getUnexpectedErrorEmbed)()] });
        }
    }
}
exports.default = AddXPCommand;
