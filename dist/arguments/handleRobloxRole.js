"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRobloxRole = void 0;
const main_1 = require("../main");
const handleRobloxRole = async (interaction, option) => {
    try {
        let allRoles = await main_1.robloxGroup.getRoles();
        if (allRoles.length > 25) {
            allRoles = allRoles.slice(0, 25);
        }
        allRoles = allRoles.filter((role) => role.rank !== 0);
        if (!option.value)
            return interaction.respond(allRoles.map((role) => {
                return {
                    name: `${role.name} (${role.rank || 0})`,
                    value: role.id.toString()
                };
            }));
        const roles = allRoles.filter((role) => role.name.toLowerCase().includes(option.value.toLowerCase()) || role.rank === option.value);
        interaction.respond(roles.map((role) => {
            return {
                name: `${role.name} (${role.rank || 0})`,
                value: role.id.toString()
            };
        }));
    }
    catch (err) { }
    ;
};
exports.handleRobloxRole = handleRobloxRole;
