"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWallForAds = void 0;
const config_1 = require("../config");
const main_1 = require("../main");
const checkWallForAds = async () => {
    setTimeout(checkWallForAds, 30000);
    try {
        const group = await main_1.robloxClient.getGroup(config_1.config.groupId);
        const posts = await group.getWallPosts({ limit: 100, sortOrder: 'Desc' });
        posts.data?.forEach((post, index) => {
            setTimeout(async () => {
                if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gm.test(post.body)) {
                    await group.deleteWallPost(post.id);
                }
            }, 1000 * index);
        });
    }
    catch (err) {
        console.error(err);
    }
};
exports.checkWallForAds = checkWallForAds;
