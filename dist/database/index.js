"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provider = void 0;
const prisma_1 = require("./prisma");
let provider = new prisma_1.PrismaProvider();
exports.provider = provider;
