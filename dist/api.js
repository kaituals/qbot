"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSignal = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const database_1 = require("./database");
const handleLogging_1 = require("./handlers/handleLogging");
const main_1 = require("./main");
const ms_1 = __importDefault(require("ms"));
const handleXpRankup_1 = require("./handlers/handleXpRankup");
const app = (0, express_1.default)();
require('dotenv').config();
let signals = [];
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.sendStatus(200);
});
const generateSignalId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    if (signals.find((signal) => signal.id === result))
        return generateSignalId();
    return result;
};
const addSignal = (signal) => {
    signals.push({
        id: generateSignalId(),
        signal,
    });
};
exports.addSignal = addSignal;
if (config_1.config.api) {
    app.use((req, res, next) => {
        if (!req.headers.authorization || req.headers.authorization !== process.env.API_KEY)
            return res.send({ success: false, msg: 'Unauthorized' });
        next();
    });
    app.get('/user', async (req, res) => {
        const { id } = req.query;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxUser = await main_1.robloxClient.getUser(id);
            const userData = await database_1.provider.findUser(robloxUser.id.toString());
            if (!userData)
                throw new Error();
            return res.send({
                success: true,
                robloxId: userData.robloxId,
                xp: userData.xp,
                suspendedUntil: userData.suspendedUntil,
                unsuspendRank: userData.unsuspendRank,
                isBanned: userData.isBanned,
            });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to get information.' });
        }
    });
    app.get('/suspensions', async (req, res) => {
        try {
            const suspensions = await database_1.provider.findSuspendedUsers();
            if (suspensions.length == 0)
                return res.send({ success: true, msg: 'No currently suspended users.' });
            const data = JSON.stringify(suspensions);
            return res.send({ success: true, data });
        }
        catch (e) {
            return res.send({ success: false, msg: 'Failed to get suspensions.' });
        }
    });
    app.get('/join-requests', async (req, res) => {
        try {
            const joinRequests = await main_1.robloxGroup.getJoinRequests({ limit: 100 });
            return res.send({
                success: true,
                requests: joinRequests.data,
            });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to get join requests.' });
        }
    });
    app.get('/signals', async (req, res) => {
        return res.send(signals);
    });
    app.post('/signals/complete', async (req, res) => {
        const { id } = req.query;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const signalIndex = signals.findIndex((signal) => signal.id === id);
            if (signalIndex === -1)
                throw new Error();
            signals.splice(signalIndex, 1);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to mark signal as completed.' });
        }
    });
    app.post('/promote', async (req, res) => {
        const { id } = req.body;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const groupRoles = await main_1.robloxGroup.getRoles();
            const currentRoleIndex = groupRoles.findIndex((role) => role.rank === robloxMember.role.rank);
            const role = groupRoles[currentRoleIndex + 1];
            if (!role)
                throw new Error();
            await main_1.robloxGroup.updateMember(Number(id), role.id);
            (0, handleLogging_1.logAction)('Promote', 'API Action', robloxMember.name, robloxMember, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to rank.' });
        }
    });
    app.post('/demote', async (req, res) => {
        const { id } = req.body;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const groupRoles = await main_1.robloxGroup.getRoles();
            const currentRoleIndex = groupRoles.findIndex((role) => role.rank === robloxMember.role.rank);
            const role = groupRoles[currentRoleIndex - 1];
            if (!role)
                throw new Error();
            await main_1.robloxGroup.updateMember(Number(id), role.id);
            (0, handleLogging_1.logAction)('Demote', 'API Action', robloxMember.name, robloxMember, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to rank.' });
        }
    });
    app.post('/fire', async (req, res) => {
        const { id } = req.body;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const groupRoles = await main_1.robloxGroup.getRoles();
            const role = groupRoles.find((role) => role.rank === config_1.config.firedRank);
            if (!role)
                throw new Error();
            await main_1.robloxGroup.updateMember(Number(id), role.id);
            (0, handleLogging_1.logAction)('Fire', 'API Action', null, robloxMember, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to rank.' });
        }
    });
    app.post('/setrank', async (req, res) => {
        const { id, role } = req.body;
        if (!id || !role)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const groupRoles = await main_1.robloxGroup.getRoles();
            const newRole = groupRoles.find((r) => Number(role) === r.rank || Number(role) === r.id || String(role).toLowerCase() === r.name.toLowerCase());
            if (!newRole)
                throw new Error();
            await main_1.robloxGroup.updateMember(Number(id), newRole.id);
            (0, handleLogging_1.logAction)('Set Rank', 'API Action', null, robloxMember, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${newRole.name} (${newRole.rank})`);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to rank.' });
        }
    });
    app.post('/suspend', async (req, res) => {
        const { id, duration } = req.body;
        if (!id || !duration)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const groupRoles = await main_1.robloxGroup.getRoles();
            const role = groupRoles.find((role) => role.rank === config_1.config.suspendedRank);
            if (!role)
                throw new Error();
            const userData = await database_1.provider.findUser(robloxMember.id.toString());
            if (userData.suspendedUntil)
                throw new Error();
            if (robloxMember.role.id !== role.id) {
                await main_1.robloxGroup.updateMember(Number(id), role.id);
            }
            const durationInMs = Number((0, ms_1.default)(duration));
            if (durationInMs < 0.5 * 60000 && durationInMs > 6.31138519 * (10 ^ 10))
                throw new Error();
            const endDate = new Date();
            endDate.setMilliseconds(endDate.getMilliseconds() + durationInMs);
            (0, handleLogging_1.logAction)('Suspend', 'API Action', null, robloxMember, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`, endDate);
            await database_1.provider.updateUser(robloxMember.id.toString(), { suspendedUntil: endDate, unsuspendRank: robloxMember.role.id });
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to rank.' });
        }
    });
    app.post('/unsuspend', async (req, res) => {
        const { id } = req.body;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const userData = await database_1.provider.findUser(robloxMember.id.toString());
            if (!userData.suspendedUntil)
                throw new Error();
            if (robloxMember.role.id !== userData.unsuspendRank) {
                await main_1.robloxGroup.updateMember(Number(id), userData.unsuspendRank);
            }
            const groupRoles = await main_1.robloxGroup.getRoles();
            const role = groupRoles.find((role) => role.rank === userData.unsuspendRank);
            if (!role)
                throw new Error();
            (0, handleLogging_1.logAction)('Unsuspend', 'API Action', null, robloxMember, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
            await database_1.provider.updateUser(robloxMember.id.toString(), { suspendedUntil: null, unsuspendRank: null });
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to rank.' });
        }
    });
    app.post('/xp/add', async (req, res) => {
        const { id, amount } = req.body;
        if (!id || !amount)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const userData = await database_1.provider.findUser(robloxMember.id.toString());
            const xp = Number(userData.xp) + Number(amount);
            (0, handleLogging_1.logAction)('Add XP', 'API Action', null, robloxMember, null, null, null, `${userData.xp} → ${xp} (+${Number(amount)})`);
            await database_1.provider.updateUser(robloxMember.id.toString(), { xp });
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to add xp.' });
        }
    });
    app.post('/xp/remove', async (req, res) => {
        const { id, amount } = req.body;
        if (!id || !amount)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const userData = await database_1.provider.findUser(robloxMember.id.toString());
            const xp = Number(userData.xp) - Number(amount);
            (0, handleLogging_1.logAction)('Remove XP', 'API Action', null, robloxMember, null, null, null, `${userData.xp} → ${xp} (+${Number(amount)})`);
            await database_1.provider.updateUser(robloxMember.id.toString(), { xp });
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to remove xp.' });
        }
    });
    app.post('/xp/rankup', async (req, res) => {
        const { id } = req.body;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxMember = await main_1.robloxGroup.getMember(Number(id));
            if (!robloxMember)
                throw new Error();
            const groupRoles = await main_1.robloxGroup.getRoles();
            const userData = await database_1.provider.findUser(robloxMember.id.toString());
            const role = await (0, handleXpRankup_1.findEligibleRole)(robloxMember, groupRoles, userData.xp);
            if (!role)
                return res.send({ success: false, msg: 'No rankup available.' });
            await main_1.robloxGroup.updateMember(robloxMember.id, role.id);
            (0, handleLogging_1.logAction)('XP Rankup', 'API Action', null, robloxMember, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to rank.' });
        }
    });
    app.post('/shout', async (req, res) => {
        let { content } = req.body;
        if (!content)
            content = '';
        try {
            await main_1.robloxGroup.updateShout(content);
            (0, handleLogging_1.logAction)('Shout', 'API Action', null, null, null, null, content);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to shout.' });
        }
    });
    app.post('/join-requests/accept', async (req, res) => {
        const { id } = req.body;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxUser = await main_1.robloxClient.getUser(id);
            await main_1.robloxGroup.acceptJoinRequest(robloxUser.id);
            (0, handleLogging_1.logAction)('Accept Join Request', 'API Action', null, robloxUser);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to accept join request.' });
        }
    });
    app.post('/join-requests/deny', async (req, res) => {
        const { id } = req.body;
        if (!id)
            return res.send({ success: false, msg: 'Missing parameters.' });
        try {
            const robloxUser = await main_1.robloxClient.getUser(id);
            await main_1.robloxGroup.declineJoinRequest(robloxUser.id);
            (0, handleLogging_1.logAction)('Deny Join Request', 'API Action', null, robloxUser);
            return res.send({ success: true });
        }
        catch (err) {
            return res.send({ success: false, msg: 'Failed to deny join request.' });
        }
    });
}
app.listen(process.env.PORT || 3001);
