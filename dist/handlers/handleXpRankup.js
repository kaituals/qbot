"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEligibleRole = void 0;
const config_1 = require("../config");
const findEligibleRole = async (member, roles, xp) => {
    const role = roles.find((role) => role.rank === config_1.config.xpSystem.roles.sort((a, b) => a.xp + b.xp).find((role) => xp >= role.xp)?.rank);
    if (role && (member.role.id === role.id || role.rank <= member.role.rank))
        return null;
    return role;
};
exports.findEligibleRole = findEligibleRole;
