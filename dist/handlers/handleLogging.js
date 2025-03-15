"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogChannels = exports.logAction = void 0;
const main_1 = require("../main");
const locale_1 = require("./locale");
const config_1 = require("../config");
const abuseDetection_1 = require("./abuseDetection");
let actionLogChannel;
const getLogChannels = async () => {
    if (config_1.config.logChannels.actions) {
        actionLogChannel = await main_1.discordClient.channels.fetch(config_1.config.logChannels.actions);
    }
};
exports.getLogChannels = getLogChannels;
const logAction = async (action, moderator, reason, target, rankChange, endDate, body, xpChange) => {
    if (moderator.id !== main_1.discordClient.user.id)
        (0, abuseDetection_1.recordAction)(moderator);
    if (!actionLogChannel)
        return;
    actionLogChannel.send({ embeds: [await (0, locale_1.getLogEmbed)(action, moderator, reason, target, rankChange, endDate, body, xpChange)] });
};
exports.logAction = logAction;
