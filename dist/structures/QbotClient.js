"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QbotClient = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const fs_1 = require("fs");
const main_1 = require("../main");
const locale_1 = require("../handlers/locale");
const handleLogging_1 = require("../handlers/handleLogging");
require('dotenv').config();
class QbotClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.GuildMessageReactions,
                discord_js_1.GatewayIntentBits.MessageContent,
            ]
        });
        this.config = config_1.config;
        this.on('ready', () => {
            console.log(locale_1.qbotLaunchTextDisplay);
            console.log(locale_1.welcomeText);
            if (this.application.botPublic)
                return console.log(locale_1.securityText);
            console.log(locale_1.startedText);
            console.log((0, locale_1.getListeningText)(process.env.PORT || 3001));
            this.loadCommands();
            (0, handleLogging_1.getLogChannels)();
            if (config_1.config.activity.enabled) {
                this.user.setActivity(config_1.config.activity.value, {
                    type: config_1.config.activity.type,
                    url: config_1.config.activity.url,
                });
            }
            if (config_1.config.status !== 'online')
                this.user.setStatus(config_1.config.status);
        });
    }
    /**
     * Load all commands into the commands object of QbotClient.
     */
    loadCommands() {
        const rawModules = (0, fs_1.readdirSync)('./src/commands');
        const loadPromise = new Promise((resolve, reject) => {
            let commands = [];
            rawModules.forEach(async (module, moduleIndex) => {
                const rawCommands = (0, fs_1.readdirSync)(`./src/commands/${module}`);
                rawCommands.forEach(async (cmdName, cmdIndex) => {
                    var _a;
                    const { default: command } = await (_a = `../commands/${module}/${cmdName.replace('.ts', '')}`, Promise.resolve().then(() => __importStar(require(_a))));
                    commands.push(command);
                    if (moduleIndex === rawModules.length - 1 && cmdIndex === rawCommands.length - 1)
                        resolve(commands);
                });
            });
        });
        loadPromise.then(async (commands) => {
            const slashCommands = commands.map((cmd) => new cmd().generateAPICommand());
            const currentCommands = require('../resources/commands.json');
            if (JSON.stringify(currentCommands) !== JSON.stringify(slashCommands)) {
                (0, fs_1.writeFileSync)('./src/resources/commands.json', JSON.stringify(slashCommands), 'utf-8');
                main_1.discordClient.application.commands.set(slashCommands);
            }
            this.commands = commands;
        });
    }
}
exports.QbotClient = QbotClient;
