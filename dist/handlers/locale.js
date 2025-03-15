"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvalidXPEmbed = exports.getNoPermissionEmbed = exports.getNoRankBelowEmbed = exports.getNoRankAboveEmbed = exports.getUnexpectedErrorEmbed = exports.getAlreadySuspendedEmbed = exports.getCommandNotFoundEmbed = exports.getUserNotBannedEmbed = exports.getUserBannedEmbed = exports.getUserSuspendedEmbed = exports.getSuccessfulDenyJoinRequestEmbed = exports.getSuccessfulAcceptJoinRequestEmbed = exports.getSuccessfulUnsuspendEmbed = exports.getSuccessfulSuspendEmbed = exports.getSuccessfulXPChangeEmbed = exports.getSuccessfulXPRankupEmbed = exports.getSuccessfulRevertRanksEmbed = exports.getSuccessfulSignalEmbed = exports.getSuccessfulShoutEmbed = exports.getSuccessfulSetRankEmbed = exports.getSuccessfulExileEmbed = exports.getSuccessfulFireEmbed = exports.getSuccessfulDemotionEmbed = exports.getSuccessfulPromotionEmbed = exports.getSuccessfulAddingAndRankupEmbed = exports.getNoJoinRequestEmbed = exports.getRobloxUserIsNotMemberEmbed = exports.getNoDatabaseEmbed = exports.getInvalidRobloxUserEmbed = exports.getMissingArgumentsEmbed = exports.getUnknownCommandMessage = exports.getListeningText = exports.noSuspendedRankLog = exports.noFiredRankLog = exports.securityText = exports.startedText = exports.welcomeText = exports.qbotLaunchTextDisplay = exports.consoleClear = exports.consoleRed = exports.consoleYellow = exports.consoleGreen = exports.consoleMagenta = exports.redColor = exports.greenColor = exports.mainColor = exports.quoteIconUrl = exports.infoIconUrl = exports.xmarkIconUrl = exports.checkIconUrl = void 0;
exports.getSuccessfulGroupUnbanEmbed = exports.getSuccessfulGroupBanEmbed = exports.getJoinRequestsEmbed = exports.getCommandListEmbed = exports.getCommandInfoEmbed = exports.getMemberCountMilestoneEmbed = exports.getMemberCountMessage = exports.getNotSuspendedEmbed = exports.getRoleListEmbed = exports.getUserInfoEmbed = exports.getPartialUserInfoEmbed = exports.getAlreadyRankedEmbed = exports.getLogEmbed = exports.getWallPostEmbed = exports.getShoutLogEmbed = exports.getInvalidDurationEmbed = exports.getRoleNotFoundEmbed = exports.getAlreadyFiredEmbed = exports.getVerificationChecksFailedEmbed = exports.getNoRankupAvailableEmbed = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const discord_js_2 = require("discord.js");
const main_1 = require("../main");
const figlet_1 = require("figlet");
exports.checkIconUrl = 'https://cdn.lengolabs.com/qbot-icons/check.png';
exports.xmarkIconUrl = 'https://cdn.lengolabs.com/qbot-icons/xmark.png';
exports.infoIconUrl = 'https://cdn.lengolabs.com/qbot-icons/info.png';
exports.quoteIconUrl = 'https://cdn.lengolabs.com/qbot-icons/quote.png';
exports.mainColor = '#906FED';
exports.greenColor = '#50C790';
exports.redColor = '#FA5757';
exports.consoleMagenta = '\x1b[35m';
exports.consoleGreen = '\x1b[32m';
exports.consoleYellow = '\x1b[33m';
exports.consoleRed = '\x1b[31m';
exports.consoleClear = '\x1b[0m';
exports.qbotLaunchTextDisplay = `${exports.consoleMagenta}${(0, figlet_1.textSync)('Qbot')}`;
exports.welcomeText = `${exports.consoleYellow}Hey, thanks for using Qbot! If you run into any issues, please do not hesitate to join our support server: https://lengolabs.com/discord`;
exports.startedText = `\n${exports.consoleGreen}✓  ${exports.consoleClear}Your bot has been started.`;
exports.securityText = `\n${exports.consoleRed}⚠  ${exports.consoleClear}URGENT: For security reasons, public bot must be DISABLED for the bot to start. For more information, please refer to this section of our documentation: https://docs.lengolabs.com/qbot/setup/replit-guide#discord`;
exports.noFiredRankLog = `Uh oh, you do not have a fired rank with the rank specified in your configuration file.`;
exports.noSuspendedRankLog = `Uh oh, you do not have a suspended rank with the rank specified in your configuration file.`;
const getListeningText = (port) => `${exports.consoleGreen}✓  ${exports.consoleClear}Listening on port ${port}.`;
exports.getListeningText = getListeningText;
const getHeadshotImage = async (userId) => {
    return (await main_1.robloxClient.apis.thumbnailsAPI.getUsersAvatarHeadShotImages({ userIds: [userId], size: '48x48', format: 'png' })).data[0];
};
const getUnknownCommandMessage = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Command Unavailable', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This command is not available here, or there was an unexpected error finding it on our system.');
    return embed;
};
exports.getUnknownCommandMessage = getUnknownCommandMessage;
const getMissingArgumentsEmbed = (cmdName, args) => {
    let argString = '';
    args.forEach((arg) => {
        if (arg.isLegacyFlag) {
            argString += arg.required || true ? `--<${arg.trigger}> ` : `--[${arg.trigger}] `;
        }
        else {
            argString += arg.required || true ? `<${arg.trigger}> ` : `[${arg.trigger}] `;
        }
    });
    argString = argString.substring(0, argString.length - 1);
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Invalid Usage', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription(`Command Usage: \`${config_1.config.legacyCommands.prefixes[0]}${cmdName} ${argString}\``)
        .setFooter({ text: config_1.config.slashCommands ? 'Tip: Slash commands automatically display the required arguments for commands.' : '' });
    return embed;
};
exports.getMissingArgumentsEmbed = getMissingArgumentsEmbed;
const getInvalidRobloxUserEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Query Unsuccessful', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('The Roblox user you searched for does not exist.');
    return embed;
};
exports.getInvalidRobloxUserEmbed = getInvalidRobloxUserEmbed;
const getNoDatabaseEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Command Disabled', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This command requires the database to be setup, and one has not been set up for this bot.');
    return embed;
};
exports.getNoDatabaseEmbed = getNoDatabaseEmbed;
const getRobloxUserIsNotMemberEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Unable to Rank', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('The Roblox user you searched for is not a member of the Roblox group.');
    return embed;
};
exports.getRobloxUserIsNotMemberEmbed = getRobloxUserIsNotMemberEmbed;
const getNoJoinRequestEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'No Join Request', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user does not have a pending join request to review.');
    return embed;
};
exports.getNoJoinRequestEmbed = getNoJoinRequestEmbed;
const getSuccessfulAddingAndRankupEmbed = async (user, newRole, xpChange) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** has been given **${xpChange}** XP and has been promoted to **${newRole}**, becuase they had enough XP!`);
    return embed;
};
exports.getSuccessfulAddingAndRankupEmbed = getSuccessfulAddingAndRankupEmbed;
const getSuccessfulPromotionEmbed = async (user, newRole) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** has been successfully promoted to **${newRole}**!`);
    return embed;
};
exports.getSuccessfulPromotionEmbed = getSuccessfulPromotionEmbed;
const getSuccessfulDemotionEmbed = async (user, newRole) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** has been successfully demoted to **${newRole}**.`);
    return embed;
};
exports.getSuccessfulDemotionEmbed = getSuccessfulDemotionEmbed;
const getSuccessfulFireEmbed = async (user, newRole) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** has been successfully fired, and now has the **${newRole}** role.`);
    return embed;
};
exports.getSuccessfulFireEmbed = getSuccessfulFireEmbed;
const getSuccessfulExileEmbed = async (user) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** has been successfully exiled from the group.`);
    return embed;
};
exports.getSuccessfulExileEmbed = getSuccessfulExileEmbed;
const getSuccessfulSetRankEmbed = async (user, newRole) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** has successfully been ranked to the **${newRole}** role.`);
    return embed;
};
exports.getSuccessfulSetRankEmbed = getSuccessfulSetRankEmbed;
const getSuccessfulShoutEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setDescription('The group shout has been updated to that message!');
    return embed;
};
exports.getSuccessfulShoutEmbed = getSuccessfulShoutEmbed;
const getSuccessfulSignalEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setDescription('The specified command has been stored and made available to connected Roblox games using our API.');
    return embed;
};
exports.getSuccessfulSignalEmbed = getSuccessfulSignalEmbed;
const getSuccessfulRevertRanksEmbed = (actionCount) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setDescription(`Successfully started reverting back **${actionCount}** ranking actions.`);
    return embed;
};
exports.getSuccessfulRevertRanksEmbed = getSuccessfulRevertRanksEmbed;
const getSuccessfulXPRankupEmbed = async (user, newRole) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** has been successfully ranked to **${newRole}**!`);
    return embed;
};
exports.getSuccessfulXPRankupEmbed = getSuccessfulXPRankupEmbed;
const getSuccessfulXPChangeEmbed = async (user, xp) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`The XP of **${user.name}** has been updated, they now have a total of **${xp}** XP.`);
    return embed;
};
exports.getSuccessfulXPChangeEmbed = getSuccessfulXPChangeEmbed;
const getSuccessfulSuspendEmbed = async (user, newRole, endDate) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** has been successfully suspended, and will have their rank returned in <t:${Math.round(endDate.getTime() / 1000)}:R>.`);
    return embed;
};
exports.getSuccessfulSuspendEmbed = getSuccessfulSuspendEmbed;
const getSuccessfulUnsuspendEmbed = async (user, newRole) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`**${user.name}** is no longer suspended, and has been ranked back to **${newRole}**!`);
    return embed;
};
exports.getSuccessfulUnsuspendEmbed = getSuccessfulUnsuspendEmbed;
const getSuccessfulAcceptJoinRequestEmbed = async (user) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`The join request from **${user.name}** has been accepted.`);
    return embed;
};
exports.getSuccessfulAcceptJoinRequestEmbed = getSuccessfulAcceptJoinRequestEmbed;
const getSuccessfulDenyJoinRequestEmbed = async (user) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setDescription(`The join request from **${user.name}** has been denied.`);
    return embed;
};
exports.getSuccessfulDenyJoinRequestEmbed = getSuccessfulDenyJoinRequestEmbed;
const getUserSuspendedEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'User Is Suspended', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user is suspended, and cannot be ranked. Please use the unsuspend command to revert this.');
    return embed;
};
exports.getUserSuspendedEmbed = getUserSuspendedEmbed;
const getUserBannedEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'User Is Banned', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user is already banned.');
    return embed;
};
exports.getUserBannedEmbed = getUserBannedEmbed;
const getUserNotBannedEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'User Not Banned', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user is not banned, so it is impossible to unban them.');
    return embed;
};
exports.getUserNotBannedEmbed = getUserNotBannedEmbed;
const getCommandNotFoundEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Command Not Found', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('A command could not be found with that query.');
    return embed;
};
exports.getCommandNotFoundEmbed = getCommandNotFoundEmbed;
const getAlreadySuspendedEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'User Already Suspended', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user is already suspended. Please use the unsuspend command to revert this.');
    return embed;
};
exports.getAlreadySuspendedEmbed = getAlreadySuspendedEmbed;
const getUnexpectedErrorEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Unexpected Error', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('Unfortunately, something that we did not expect went wrong while processing this action. More information has been logged for the bot owner to diagnose.');
    return embed;
};
exports.getUnexpectedErrorEmbed = getUnexpectedErrorEmbed;
const getNoRankAboveEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Cannot Promote', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('There is no rank directly above this user, so you are unable to promote them.');
    return embed;
};
exports.getNoRankAboveEmbed = getNoRankAboveEmbed;
const getNoRankBelowEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Cannot Demote', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('There is no rank directly below this user, so you are unable to demote them.');
    return embed;
};
exports.getNoRankBelowEmbed = getNoRankBelowEmbed;
const getNoPermissionEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Unauthorized', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('You do not have permission to use this command.');
    return embed;
};
exports.getNoPermissionEmbed = getNoPermissionEmbed;
const getInvalidXPEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Invalid XP', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('The value of XP used in this command must be a positive integer.');
    return embed;
};
exports.getInvalidXPEmbed = getInvalidXPEmbed;
const getNoRankupAvailableEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'No Rankup Available', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('You do not have any available rankups.');
    return embed;
};
exports.getNoRankupAvailableEmbed = getNoRankupAvailableEmbed;
const getVerificationChecksFailedEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Verification Check Failed', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription(`
        To prevent you from ranking someone that you would not manually be able to rank, the bot checks the following things before allowing you to rank a user. In this case, you have failed one or more, and therefore you are unable to rank this user.

        • You are verified on this server.
        • The user you are performing this action on is not you.
        • Your rank is above the rank of the user you are trying to perform this action on.
        `);
    return embed;
};
exports.getVerificationChecksFailedEmbed = getVerificationChecksFailedEmbed;
const getAlreadyFiredEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'User Already Fired', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user already has the fired rank.');
    return embed;
};
exports.getAlreadyFiredEmbed = getAlreadyFiredEmbed;
const getRoleNotFoundEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Role Unavailable', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user you have specified does not exist on the group, or cannot be ranked by this bot.');
    return embed;
};
exports.getRoleNotFoundEmbed = getRoleNotFoundEmbed;
const getInvalidDurationEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Invalid Duration', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('Durations must be within 5 minutes and 2 years.');
    return embed;
};
exports.getInvalidDurationEmbed = getInvalidDurationEmbed;
const getShoutLogEmbed = async (shout) => {
    const shoutCreator = await main_1.robloxClient.apis.usersAPI.getUserById(shout.creator.id);
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Shout from ${shoutCreator.name}`, iconURL: exports.quoteIconUrl })
        .setThumbnail((await getHeadshotImage(shout.creator.id)).imageUrl)
        .setColor(exports.mainColor)
        .setTimestamp()
        .setDescription(shout.content);
    return embed;
};
exports.getShoutLogEmbed = getShoutLogEmbed;
const getWallPostEmbed = async (post) => {
    const postCreator = await main_1.robloxClient.apis.usersAPI.getUserById(post.poster);
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Posted by ${postCreator.name}`, iconURL: exports.quoteIconUrl })
        .setThumbnail((await getHeadshotImage(post.poster)).imageUrl)
        .setColor(exports.mainColor)
        .setTimestamp()
        .setDescription(post['body']);
    return embed;
};
exports.getWallPostEmbed = getWallPostEmbed;
const getLogEmbed = async (action, moderator, reason, target, rankChange, endDate, body, xpChange) => {
    if (target && !target.name)
        target = null;
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(exports.mainColor)
        .setTimestamp()
        .setDescription(`**Action:** ${action}\n${target ? `**Target:** ${target.name} (${target.id})\n` : ''}${rankChange ? `**Rank Change:** ${rankChange}\n` : ''}${xpChange ? `**XP Change:** ${xpChange}\n` : ''}${endDate ? `**Duration:** <t:${Math.round(endDate.getTime() / 1000)}:R>\n` : ''}${reason ? `**Reason:** ${reason}\n` : ''}${body ? `**Body:** ${body}\n` : ''}`);
    if (typeof moderator === 'string') {
        embed.setAuthor({ name: moderator });
    }
    else {
        if (moderator instanceof discord_js_2.User) {
            embed.setAuthor({ name: moderator.username, iconURL: moderator.displayAvatarURL() });
            embed.setFooter({ text: `Moderator ID: ${moderator.id}` });
        }
        else {
            embed.setAuthor({ name: moderator.username });
            embed.setThumbnail((await getHeadshotImage(target.id)).imageUrl);
        }
    }
    return embed;
};
exports.getLogEmbed = getLogEmbed;
const getAlreadyRankedEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'User Already Ranked', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user already has this rank.');
    return embed;
};
exports.getAlreadyRankedEmbed = getAlreadyRankedEmbed;
const getPartialUserInfoEmbed = async (user, data) => {
    const primaryGroup = await user.getPrimaryGroup();
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Information: ${user.name}`, iconURL: exports.infoIconUrl })
        .setColor(exports.mainColor)
        .setDescription(primaryGroup ? `Primary Group: [${primaryGroup.group.name}](https://roblox.com/groups/${primaryGroup.group.id})` : null)
        .setThumbnail((await getHeadshotImage(user.id)).imageUrl)
        .setFooter({ text: `User ID: ${user.id}` })
        .setTimestamp()
        .addFields([
        {
            name: 'Role',
            value: 'Guest (0)',
            inline: true
        },
        {
            name: 'Banned',
            value: data.isBanned ? `✅` : '❌',
            inline: true
        }
    ]);
    return embed;
};
exports.getPartialUserInfoEmbed = getPartialUserInfoEmbed;
const getUserInfoEmbed = async (user, member, data) => {
    const primaryGroup = await user.getPrimaryGroup();
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Information: ${user.name}`, iconURL: exports.infoIconUrl })
        .setColor(exports.mainColor)
        .setDescription(primaryGroup ? `Primary Group: [${primaryGroup.group.name}](https://roblox.com/groups/${primaryGroup.group.id})` : null)
        .setThumbnail((await main_1.robloxClient.apis.thumbnailsAPI.getUsersAvatarHeadShotImages({ userIds: [user.id], size: '150x150', format: 'png', isCircular: false })).data[0].imageUrl)
        .setFooter({ text: `User ID: ${user.id}` })
        .setTimestamp()
        .addFields([
        {
            name: 'Role',
            value: `${member.role.name} (${member.role.rank})`,
            inline: true
        },
        {
            name: 'XP',
            value: data.xp.toString() || '0',
            inline: true
        },
        {
            name: 'Suspended',
            value: data.suspendedUntil ? `✅ (<t:${Math.round(data.suspendedUntil.getTime() / 1000)}:R>)` : '❌',
            inline: true
        },
        {
            name: 'Banned',
            value: data.isBanned ? `✅` : '❌',
            inline: true
        }
    ]);
    return embed;
};
exports.getUserInfoEmbed = getUserInfoEmbed;
const getRoleListEmbed = (roles) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Group Roles', iconURL: exports.infoIconUrl })
        .setColor(exports.mainColor)
        .setDescription('Here is a list of all roles on the group.');
    roles.forEach((role) => {
        embed.addFields({
            name: role.name,
            value: `Rank: \`${role.rank || '0'}\``,
            inline: true
        });
    });
    return embed;
};
exports.getRoleListEmbed = getRoleListEmbed;
const getNotSuspendedEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'User Not Suspended', iconURL: exports.xmarkIconUrl })
        .setColor(exports.redColor)
        .setDescription('This user is not suspended, meaning you cannot run this command on them.');
    return embed;
};
exports.getNotSuspendedEmbed = getNotSuspendedEmbed;
const getMemberCountMessage = (oldCount, newCount) => {
    if (newCount > oldCount) {
        return `⬆️ The member count is now **${newCount}** (+${newCount - oldCount})`;
    }
    else {
        return `⬇️ The member count is now **${newCount}** (-${oldCount - newCount})`;
    }
};
exports.getMemberCountMessage = getMemberCountMessage;
const getMemberCountMilestoneEmbed = (count) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Member Milestone Reached!', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setDescription(`🎉 The member count is now **${count}**!`);
    return embed;
};
exports.getMemberCountMilestoneEmbed = getMemberCountMilestoneEmbed;
const getCommandInfoEmbed = (command) => {
    let argString = '';
    command.args.forEach((arg) => {
        argString += arg.required || true ? `<${arg.trigger}> ` : `[${arg.trigger}] `;
    });
    argString = argString.substring(0, argString.length - 1);
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Command Information', iconURL: exports.infoIconUrl })
        .setTitle(command.trigger)
        .setColor(exports.mainColor)
        .setDescription(command.description)
        .setFooter({ text: config_1.config.slashCommands ? 'Tip: Slash commands automatically display a list of available commands, and their required usage.' : '' })
        .setFields([
        {
            name: 'Module',
            value: command.module,
            inline: true
        },
        {
            name: 'Usage',
            value: `\`${argString}\``,
            inline: true
        }
    ]);
    return embed;
};
exports.getCommandInfoEmbed = getCommandInfoEmbed;
const getCommandListEmbed = (modules) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Command List', iconURL: exports.infoIconUrl })
        .setColor(exports.mainColor)
        .setDescription(config_1.config.slashCommands && config_1.config.legacyCommands ? 'Tip: Slash commands automatically display a list of available commands, and their required usage.' : null);
    Object.keys(modules).forEach((key) => {
        const moduleCommands = modules[key];
        const mappedCommands = moduleCommands.map((cmd) => `\`${cmd.trigger}\` - ${cmd.description}`);
        embed.addFields({
            name: key.replace('-', ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            value: mappedCommands.join('\n'),
        });
    });
    return embed;
};
exports.getCommandListEmbed = getCommandListEmbed;
const getJoinRequestsEmbed = (joinRequests) => {
    const requestString = joinRequests.map((request) => `- \`${request['requester'].username}\``).join('\n');
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Join Requests', iconURL: exports.infoIconUrl })
        .setColor(exports.mainColor)
        .setDescription(`${joinRequests.length !== 0 ? `There is currently ${joinRequests.length} pending join requests:\n\n${requestString}` : 'There are currently no pending join requests.'}`);
    return embed;
};
exports.getJoinRequestsEmbed = getJoinRequestsEmbed;
const getSuccessfulGroupBanEmbed = (user) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setDescription(`**${user.name}** has successfully been banned from the group.`);
    return embed;
};
exports.getSuccessfulGroupBanEmbed = getSuccessfulGroupBanEmbed;
const getSuccessfulGroupUnbanEmbed = (user) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: 'Success', iconURL: exports.checkIconUrl })
        .setColor(exports.greenColor)
        .setDescription(`**${user.name}** has successfully been unbanned from the group.`);
    return embed;
};
exports.getSuccessfulGroupUnbanEmbed = getSuccessfulGroupUnbanEmbed;
