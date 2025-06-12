"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUserMiddleware = void 0;
const user_1 = require("../controllers/user");
const syncUserMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const dbUser = yield (0, user_1.checkUser)(req.user, res);
            req.user = dbUser;
        }
        next();
    }
    catch (error) {
        console.error("Error in sync user middleware:", error);
        next();
    }
});
exports.syncUserMiddleware = syncUserMiddleware;
