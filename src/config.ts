import { ActivityType } from 'discord.js';
import { BotConfig } from './structures/types'; 

export const config: BotConfig = {
    groupId: 1195803,
    slashCommands: true,
    legacyCommands: {
        enabled: true,
        prefixes: ['b!'],
    },
    permissions: {
        all: ['1135886130982703114'],
        ranking: ['1341747124328595478'],
        users: ['1341747124328595478'],
        shout: ['1341747124328595478'],
        join: ['1135886130982703114'],
        signal: ['1135886130982703114'],
        admin: ['1135886130982703114'],
    },
    logChannels: {
        actions: '1334891910736646246',
        shout: '1334891893091336289',
    },
    api: false,
    maximumRank: 15,
    verificationChecks: false,
    bloxlinkGuildId: '656638781964812359',
    firedRank: 1,
    suspendedRank: 1,
    recordManualActions: true,
    memberCount: {
        enabled: false,
        channelId: '',
        milestone: 100,
        onlyMilestones: false,
    },
    xpSystem: {
        enabled: false,
        autoRankup: false,
        roles: [],
    },
    antiAbuse: {
        enabled: true,
        clearDuration: 3 * 20,
        threshold: 10,
        demotionRank: 1,
    },
    activity: {
        enabled: true,
        type: ActivityType.Watching,
        value: 'Burger Stop!',
    },
    status: 'idle',
    deleteWallURLs: true,
};

export const getMaxRankForUser = (userId: string) => {
    if (userId === '1135886130982703114') {
        return Number.MAX_SAFE_INTEGER;
    }
    return config.maximumRank;
};
