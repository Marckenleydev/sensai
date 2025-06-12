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
exports.generateCoverLetter = generateCoverLetter;
exports.getCoverLetters = getCoverLetters;
exports.getCoverLetter = getCoverLetter;
exports.deleteCoverLetter = deleteCoverLetter;
const generative_ai_1 = require("@google/generative-ai");
const client_1 = require("@prisma/client");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});
function generateCoverLetter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { jobTitle, companyName, jobDescription } = req.body;
        try {
            if (!jobTitle || !companyName || !jobDescription) {
                res.status(400).json({ message: "Missing required fields" });
                return;
            }
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: { clerkUserId: clerkUser.id }
            });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const prompt = `
Write a professional cover letter for a **${jobTitle}** position at **${companyName}**.

**About the candidate:**
- Industry: ${user.industry}
- Years of Experience: ${user.experience}
- Skills: ${(_a = user.skills) === null || _a === void 0 ? void 0 : _a.join(", ")}
- Bio: ${user.bio}

**Job Description:**
${jobDescription}

**Requirements:**
1. Use a professional, enthusiastic tone
2. Highlight relevant skills and experience
3. Show understanding of the company's needs
4. Keep it concise (max 400 words)
5. Use proper business letter formatting in markdown
6. Include specific examples of achievements
7. Relate candidate's background to job requirements

Format the letter in markdown.
    `;
            const result = yield model.generateContent(prompt);
            const content = result.response.text().trim();
            const coverLetter = yield prisma.coverLetter.create({
                data: {
                    content,
                    jobTitle,
                    companyName,
                    jobDescription,
                    status: "completed",
                    userId: user.id,
                },
            });
            res.status(200).json(coverLetter);
        }
        catch (error) {
            console.error("Error generating cover letter:", error.message);
            res.status(500).json({ message: "Failed to generate cover letter" });
        }
    });
}
function getCoverLetters(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: { clerkUserId: clerkUser.id }
            });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const coverLetter = yield prisma.coverLetter.findMany({
                where: {
                    userId: user.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            res.status(200).json(coverLetter);
        }
        catch (error) {
            console.error("Error getting cover letters:", error.message);
            res.status(500).json({ message: "Failed to get cover letters" });
        }
    });
}
function getCoverLetter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "Cover letter ID is required" });
                return;
            }
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: { clerkUserId: clerkUser.id }
            });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            return yield prisma.coverLetter.findUnique({
                where: {
                    id: id,
                    userId: user.id,
                },
            });
        }
        catch (error) {
            console.error("Error getting cover letter:", error.message);
            res.status(500).json({ message: "Failed to get cover letter" });
        }
    });
}
function deleteCoverLetter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "Cover letter ID is required" });
                return;
            }
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: { clerkUserId: clerkUser.id }
            });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            yield prisma.coverLetter.delete({
                where: {
                    id,
                    userId: user.id,
                },
            });
            res.status(200).json({ message: "Cover letter deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting cover letter:", error.message);
            res.status(500).json({ message: "Failed to delete cover letter" });
        }
    });
}
