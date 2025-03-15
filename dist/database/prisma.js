"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProvider = void 0;
const client_1 = require("@prisma/client");
const DatabaseProvider_1 = require("../structures/DatabaseProvider");
require('dotenv').config();
class PrismaProvider extends DatabaseProvider_1.DatabaseProvider {
    constructor() {
        super();
        this.db = new client_1.PrismaClient();
    }
    async findUser(robloxId) {
        let userData = await this.db.user.findUnique({ where: { robloxId } });
        if (!userData)
            userData = await this.db.user.create({ data: { robloxId } });
        return userData;
    }
    async findSuspendedUsers() {
        return await this.db.user.findMany({ where: { suspendedUntil: { not: null } } });
    }
    async findBannedUsers() {
        return await this.db.user.findMany({ where: { isBanned: true } });
    }
    async updateUser(robloxId, data) {
        let userData = await this.db.user.findUnique({ where: { robloxId } });
        if (!userData)
            userData = await this.db.user.create({ data: { robloxId } });
        const newData = userData;
        Object.keys(data).forEach((key) => newData[key] = data[key]);
        return await this.db.user.update({ where: { robloxId }, data: userData });
    }
}
exports.PrismaProvider = PrismaProvider;
