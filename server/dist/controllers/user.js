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
exports.updateUserProfile = exports.checkUser = void 0;
exports.getUserOnboardingStatus = getUserOnboardingStatus;
const client_1 = require("@prisma/client");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const industryInsight_1 = require("./industryInsight");
const prisma = new client_1.PrismaClient();
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser((_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId);
        if (!clerkUser) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const existingUser = yield prisma.user.findUnique({
            where: { clerkUserId: clerkUser.id }
        });
        if (existingUser) {
            res.status(200).json({
                message: "User profile retrieved successfully",
                user: existingUser
            });
            return;
        }
        const name = `${clerkUser.firstName} ${clerkUser.lastName}`;
        const newUser = yield prisma.user.create({
            data: {
                clerkUserId: clerkUser.id,
                name: name,
                imageUrl: clerkUser.imageUrl,
                email: clerkUser.emailAddresses[0].emailAddress
            }
        });
        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    }
    catch (error) {
        console.error("Error creating User", error);
        res.status(500).json({ message: "Error creating User" });
    }
});
exports.checkUser = checkUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { industry, experience, bio, skills } = req.body;
    try {
        const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
        if (!clerkUser) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const user = yield prisma.user.findUnique({ where: { clerkUserId: clerkUser.id }, include: { industryInsight: true } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            let industryInsight = yield tx.industryInsight.findUnique({
                where: {
                    industry: industry
                }
            });
            if (!industryInsight) {
                const insights = yield (0, industryInsight_1.generateAIInsights)(industry);
                industryInsight = yield prisma.industryInsight.create({
                    data: Object.assign(Object.assign({ industry: industry }, insights), { demandLevel: insights.demandLevel.toUpperCase(), marketOutlook: insights.marketOutlook.toUpperCase(), nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
                });
            }
            const updateUser = yield tx.user.update({
                where: {
                    id: user.id
                },
                data: {
                    industry: industry,
                    experience: experience,
                    bio: bio,
                    skills: skills,
                }
            });
            return { updateUser, industryInsight };
        }), { timeout: 10000 });
        res.status(200).json({ message: "User  profile update Successfully" });
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
});
exports.updateUserProfile = updateUserProfile;
function getUserOnboardingStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not found in Clerk" });
                return;
            }
            // Single database query to get user with industry field
            const user = yield prisma.user.findUnique({
                where: {
                    clerkUserId: clerkUser.id
                },
                select: {
                    industry: true,
                }
            });
            if (!user) {
                res.status(404).json({ message: "User not found in database" });
                return;
            }
            res.status(200).json({
                isOnboarded: !!user.industry,
            });
            return;
        }
        catch (error) {
            console.error("Error getting user onboarding status:", error.message);
            res.status(500).json({ message: "Failed to get user onboarding status" });
        }
    });
}
