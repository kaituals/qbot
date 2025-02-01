import { ActivityType } from 'discord.js';
import { BotConfig } from './structures/types'; 

export const config: BotConfig = {
    groupId: 1195803,
    slashCommands: true,
    legacyCommands: {
        enabled: true,
        prefixes: ['!'],
    },
    permissions: {
        all: ['Department Overseer'],
        ranking: ['Rank Commander'],
        users: ['Rank Commander'],
        shout: ['Rank Commander'],
        join: ['Department Overseer'],
        signal: ['Department Overseer'],
        admin: ['Department Overseer'],
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
        enabled: false,
        clearDuration: 1 * 60,
        threshold: 10,
        demotionRank: 1,
    },
    activity: {
        enabled: true,
        type: ActivityType.Watching,
        value: 'Ranking',
    },
    status: 'dnd',
    deleteWallURLs: true,
}
