"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkActionEligibility = void 0;
const main_1 = require("../main");
const accountLinks_1 = require("./accountLinks");
const checkActionEligibility = async (discordId, guildId, targetMember, rankingTo) => {
    let robloxUser;
    try {
        robloxUser = await (0, accountLinks_1.getLinkedRobloxUser)(discordId);
    }
    catch (err) {
        return false;
    }
    let robloxMember;
    try {
        robloxMember = await main_1.robloxGroup.getMember(robloxUser.id);
        if (!robloxMember)
            throw new Error();
    }
    catch (err) {
        return false;
    }
    if (robloxMember.role.rank <= targetMember.role.rank)
        return false;
    if (robloxMember.role.rank <= rankingTo)
        return false;
    if (robloxMember.id === targetMember.id)
        return false;
    return true;
};
exports.checkActionEligibility = checkActionEligibility;
