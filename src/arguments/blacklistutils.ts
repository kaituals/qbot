import fs from 'fs';

const blacklistFile = './blacklist.json';

// Load blacklisted users from a file
export function loadBlacklist(): string[] {
    if (fs.existsSync(blacklistFile)) {
        const data = fs.readFileSync(blacklistFile, 'utf-8');
        return JSON.parse(data);
    }
    return [];  // Return an empty array if the file doesn't exist yet
}

// Save blacklisted users to a file
export function saveBlacklist(blacklistedUsers: string[]): void {
    fs.writeFileSync(blacklistFile, JSON.stringify(blacklistedUsers));
}

// Add a user to the blacklist
export function addToBlacklist(userId: string): void {
    const blacklistedUsers = loadBlacklist();
    if (!blacklistedUsers.includes(userId)) {
        blacklistedUsers.push(userId);
        saveBlacklist(blacklistedUsers);
    }
}

// Check if a user is blacklisted
export function isUserBlacklisted(userId: string): boolean {
    const blacklistedUsers = loadBlacklist();
    return blacklistedUsers.includes(userId);
}
