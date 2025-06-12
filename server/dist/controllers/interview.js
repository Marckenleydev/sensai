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
exports.generateQuiz = generateQuiz;
exports.saveQuizResult = saveQuizResult;
exports.getAssessment = getAssessment;
const generative_ai_1 = require("@google/generative-ai");
const client_1 = require("@prisma/client");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
function generateQuiz(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({
                where: {
                    clerkUserId: clerkUser.id,
                },
                select: {
                    industry: true,
                    skills: true,
                },
            });
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            const prompt = `
    Generate 10 technical interview questions for a ${user.industry} professional${((_a = user.skills) === null || _a === void 0 ? void 0 : _a.length) ? ` with expertise in ${user.skills.join(", ")}` : ""}.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;
            const result = yield model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
            const quiz = JSON.parse(cleanedText);
            res.status(201).json(quiz.questions);
            return;
        }
        catch (error) {
            console.error("Error generatingQuiz status:", error.message);
            res.status(500).json({ message: "Failed to generateQuiz" });
        }
    });
}
function saveQuizResult(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { questions, answers, score } = req.body;
        try {
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            const questionResults = questions.map((q, index) => ({
                question: q.question,
                answer: q.correctAnswer,
                userAnswer: answers[index],
                isCorrect: q.correctAnswer === answers[index],
                explanation: q.explanation,
            }));
            // Get wrong answers
            const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
            // Only generate improvement tips if there are wrong answers
            let improvementTip = null;
            if (wrongAnswers.length > 0) {
                const wrongQuestionsText = wrongAnswers
                    .map((q) => `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`)
                    .join("\n\n");
                const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
                try {
                    const tipResult = yield model.generateContent(improvementPrompt);
                    improvementTip = tipResult.response.text().trim();
                }
                catch (error) {
                    console.error("Error generating improvement tip:", error);
                    // Continue without improvement tip if generation fails
                }
            }
            const assessment = yield prisma.assessment.create({
                data: {
                    userId: user.id,
                    quizScore: score,
                    questions: questionResults,
                    category: "Technical",
                    improvementTip,
                },
            });
            res.status(201).json(assessment);
        }
        catch (error) {
            console.error("Error save Quiz status:", error.message);
            res.status(500).json({ message: "Failed to save Quiz" });
        }
    });
}
function getAssessment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clerkUser = yield clerk_sdk_node_1.clerkClient.users.getUser(req.auth.userId);
            if (!clerkUser) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const user = yield prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            const assessments = yield prisma.assessment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } });
            res.status(200).json(assessments);
        }
        catch (error) {
            console.error("Error getting Assessment:", error.message);
            res.status(500).json({ message: "Failed to get Assessment" });
        }
    });
}
