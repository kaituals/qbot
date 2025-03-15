"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordMemberCount = void 0;
const config_1 = require("../config");
const main_1 = require("../main");
const locale_1 = require("../handlers/locale");
let firstRecord = true;
let lastRemainder;
let lastMemberCount;
const recordMemberCount = async () => {
    setTimeout(recordMemberCount, 60 * 1000);
    try {
        if (!firstRecord) {
            const group = await main_1.robloxClient.getGroup(config_1.config.groupId);
            const memberCountChannel = await main_1.discordClient.channels.cache.get(config_1.config.memberCount.channelId);
            if (group.memberCount === lastMemberCount)
                return;
            if (config_1.config.memberCount.milestone) {
                const currentRemainder = group.memberCount % config_1.config.memberCount.milestone;
                if (lastMemberCount < group.memberCount && (currentRemainder === 0 || lastRemainder > currentRemainder)) {
                    memberCountChannel.send({ embeds: [(0, locale_1.getMemberCountMilestoneEmbed)(group.memberCount)] });
                }
                else {
                    if (!config_1.config.memberCount.onlyMilestones) {
                        memberCountChannel.send({ content: (0, locale_1.getMemberCountMessage)(lastMemberCount, group.memberCount) });
                    }
                }
                lastRemainder = currentRemainder;
            }
            else {
                memberCountChannel.send({ content: (0, locale_1.getMemberCountMessage)(lastMemberCount, group.memberCount) });
            }
            lastMemberCount = group.memberCount;
        }
        else {
            const group = await main_1.robloxClient.getGroup(config_1.config.groupId);
            lastMemberCount = group.memberCount;
            if (config_1.config.memberCount.milestone)
                lastRemainder = group.memberCount % config_1.config.memberCount.milestone;
            firstRecord = false;
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.recordMemberCount = recordMemberCount;
