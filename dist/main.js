"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.robloxGroup = exports.robloxClient = exports.discordClient = void 0;
const QbotClient_1 = require("./structures/QbotClient");
const bloxy_1 = require("bloxy");
const handleInteraction_1 = require("./handlers/handleInteraction");
const handleLegacyCommand_1 = require("./handlers/handleLegacyCommand");
const config_1 = require("./config");
const shout_1 = require("./events/shout");
const suspensions_1 = require("./events/suspensions");
const audit_1 = require("./events/audit");
const member_1 = require("./events/member");
const abuseDetection_1 = require("./handlers/abuseDetection");
const bans_1 = require("./events/bans");
const wall_1 = require("./events/wall");
require('dotenv').config();
// [Ensure Setup]
if (!process.env.ROBLOX_COOKIE) {
    console.error('ROBLOX_COOKIE is not set in the .env file.');
    process.exit(1);
}
require('./database');
require('./api');
// [Clients]
const discordClient = new QbotClient_1.QbotClient();
exports.discordClient = discordClient;
discordClient.login(process.env.DISCORD_TOKEN);
const robloxClient = new bloxy_1.Client({ credentials: { cookie: process.env.ROBLOX_COOKIE } });
exports.robloxClient = robloxClient;
let robloxGroup = null;
exports.robloxGroup = robloxGroup;
(async () => {
    await robloxClient.login().catch(console.error);
    exports.robloxGroup = robloxGroup = await robloxClient.getGroup(config_1.config.groupId);
    // [Events]
    (0, suspensions_1.checkSuspensions)();
    (0, bans_1.checkBans)();
    if (config_1.config.logChannels.shout)
        (0, shout_1.recordShout)();
    if (config_1.config.recordManualActions)
        (0, audit_1.recordAuditLogs)();
    if (config_1.config.memberCount.enabled)
        (0, member_1.recordMemberCount)();
    if (config_1.config.antiAbuse.enabled)
        (0, abuseDetection_1.clearActions)();
    if (config_1.config.deleteWallURLs)
        (0, wall_1.checkWallForAds)();
})();
// [Handlers]
discordClient.on('interactionCreate', handleInteraction_1.handleInteraction);
discordClient.on('messageCreate', handleLegacyCommand_1.handleLegacyCommand);
