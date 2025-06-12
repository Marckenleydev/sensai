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
exports.saveResume = saveResume;
exports.getResume = getResume;
exports.improveWithAI = improveWithAI;
const generative_ai_1 = require("@google/generative-ai");
const client_1 = require("@prisma/client");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
function saveResume(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { content } = req.body;
        try {
            if (!content || typeof content !== "string") {
                res.status(400).json({ message: "Invalid resume content" });
                return;
            }
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: {
                    clerkUserId: clerkUser.id,
                }
            });
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            const resume = yield prisma.resume.upsert({
                where: {
                    userId: user.id,
                },
                update: {
                    content,
                },
                create: {
                    userId: user.id,
                    content,
                },
            });
            res.status(201).json(resume);
            return;
        }
        catch (error) {
            console.error("Error savingResume:", error.message);
            res.status(500).json({ message: "Failed to save resume" });
        }
    });
}
function getResume(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: {
                    clerkUserId: clerkUser.id,
                }
            });
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            const resume = yield prisma.resume.findUnique({ where: { userId: user.id } });
            res.status(200).json(resume);
            return;
        }
        catch (error) {
            console.error("Error gettiningResume:", error.message);
            res.status(500).json({ message: "Failed to get resume" });
        }
    });
}
function improveWithAI(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { current, type } = req.body;
        try {
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: { clerkUserId: clerkUser.id },
                include: {
                    industryInsight: true,
                },
            });
            if (!user)
                throw new Error("User not found");
            const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;
            const result = yield model.generateContent(prompt);
            const response = result.response;
            const improvedContent = response.text().trim();
            res.status(200).json(improveWithAI);
            return;
        }
        catch (error) {
            console.error("Error improving content:", error.message);
            res.status(500).json("Failed to improve content");
        }
    });
}
