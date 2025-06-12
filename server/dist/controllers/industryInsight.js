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
exports.generateAIInsights = void 0;
exports.getIndustryInsight = getIndustryInsight;
const generative_ai_1 = require("@google/generative-ai");
const client_1 = require("@prisma/client");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});
const generateAIInsights = (industry) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;
    const result = yield model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
});
exports.generateAIInsights = generateAIInsights;
function getIndustryInsight(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: {
                    clerkUserId: clerkUser.id
                }, include: {
                    industryInsight: true
                }
            });
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.industry) {
                res.status(400).json({ message: "User industry not set" });
                return;
            }
            if (!user.industryInsight) {
                const insights = yield (0, exports.generateAIInsights)(user.industry);
                const industryInsight = yield prisma.industryInsight.create({
                    data: Object.assign(Object.assign({ industry: user.industry }, insights), { nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
                });
                res.status(200).json(industryInsight);
            }
            res.status(200).json(user.industryInsight);
        }
        catch (error) {
            console.error("Error getting industryInsight:", error.message);
            res.status(500).json({ message: "Failed to get industryInsight" });
        }
    });
}
