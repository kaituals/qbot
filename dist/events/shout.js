"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordShout = void 0;
const main_1 = require("../main");
const config_1 = require("../config");
const locale_1 = require("../handlers/locale");
let firstShout = true;
let lastShout;
const recordShout = async () => {
    try {
        const group = await main_1.robloxClient.getGroup(config_1.config.groupId);
        const logChannel = await main_1.discordClient.channels.fetch(config_1.config.logChannels.shout);
        if (firstShout) {
            firstShout = false;
        }
        else {
            if (group.shout !== null && lastShout !== group.shout.content) {
                logChannel.send({ embeds: [await (0, locale_1.getShoutLogEmbed)(group.shout)] });
            }
        }
        setTimeout(recordShout, 60 * 1000);
        if (group.shout?.content)
            lastShout = group.shout?.content;
    }
    catch (err) {
        console.error(err);
    }
};
exports.recordShout = recordShout;
