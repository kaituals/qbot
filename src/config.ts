import { ActivityType } from 'discord.js';
import { BotConfig } from './structures/types'; 

export const config: BotConfig = {
    groupId: 1195803,
    slashCommands: false,
    legacyCommands: {
        enabled: true,
        prefixes: ['!!'],
    },
    permissions: {
        all: ['1321680658179031110'],
        ranking: ['1334360532718714910'],
        users: ['1334360532718714910'],
        shout: ['1334360532718714910'],
        join: ['1321680658179031110'],
        signal: ['1321680658179031110'],
        admin: ['1321680658179031110'],
    },
    logChannels: {
        actions: '1334891910736646246',
        shout: '1334891893091336289',
    },
    api: false,
    maximumRank: 15,
    verificationChecks: false,
    bloxlinkGuildId: '',
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
        value: 'Burger Stop',
    },
    status: 'dnd',
    deleteWallURLs: false,
}
