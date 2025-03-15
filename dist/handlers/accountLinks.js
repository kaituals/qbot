"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkedRobloxUser = void 0;
const config_1 = require("../config");
const main_1 = require("../main");
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
let requestCount = 0;
const getLinkedRobloxUser = async (discordId) => {
    if (requestCount >= 60)
        return null;
    requestCount += 1;
    try {
        const robloxStatus = (await axios_1.default.get(`https://api.blox.link/v4/public/guilds/${config_1.config.bloxlinkGuildId}/discord-to-roblox/${discordId}`, { headers: { 'Authorization': process.env.BLOXLINK_KEY } })).data;
        if (robloxStatus.error)
            throw new Error(robloxStatus.error);
        const robloxUser = await main_1.robloxClient.getUser(parseInt(robloxStatus.robloxID));
        return robloxUser;
    }
    catch (err) {
        return null;
    }
    ;
};
exports.getLinkedRobloxUser = getLinkedRobloxUser;
const refreshRateLimits = () => {
    requestCount = 0;
    setTimeout(refreshRateLimits, 60000);
};
setTimeout(refreshRateLimits, 60000);
