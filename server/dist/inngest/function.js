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
exports.generateIndustryInsights = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("./client");
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const prisma = new client_1.PrismaClient();
exports.generateIndustryInsights = client_2.inngest.createFunction({ id: "Generate Industry Insights" }, { cron: "0 0 * * 0" }, // Run every Sunday at midnight
(_a) => __awaiter(void 0, [_a], void 0, function* ({ step }) {
    var _b, _c;
    const industries = yield step.run("Fetch industries", () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.industryInsight.findMany({
            select: { industry: true },
        });
    }));
    for (const { industry } of industries) {
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
        const res = yield step.ai.wrap("gemini", (p) => __awaiter(void 0, void 0, void 0, function* () {
            return yield model.generateContent(p);
        }), prompt);
        if (!res.response.candidates || res.response.candidates.length === 0) {
            console.error(`No candidates returned for industry: ${industry}`);
            continue;
        }
        const candidate = res.response.candidates[0];
        const textPart = (_c = (_b = candidate.content) === null || _b === void 0 ? void 0 : _b.parts) === null || _c === void 0 ? void 0 : _c.find((part) => "text" in part && part.text);
        if (!textPart || !("text" in textPart)) {
            console.error(`No text content returned for industry: ${industry}`);
            continue;
        }
        const text = textPart.text;
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        const insights = JSON.parse(cleanedText);
        yield step.run(`Update ${industry} insights`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.industryInsight.update({
                where: { industry },
                data: Object.assign(Object.assign({}, insights), { lastUpdated: new Date(), nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }),
            });
        }));
    }
}));
