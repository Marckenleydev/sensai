"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkMiddleware = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
exports.clerkMiddleware = (0, clerk_sdk_node_1.ClerkExpressWithAuth)();
