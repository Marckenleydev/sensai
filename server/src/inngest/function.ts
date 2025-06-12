import { PrismaClient } from "@prisma/client";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const prisma = new PrismaClient();
export const generateIndustryInsights = inngest.createFunction(
  { id: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await prisma.industryInsight.findMany({
        select: { industry: true },
      });
    });
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
      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );
      if (!res.response.candidates || res.response.candidates.length === 0) {
        console.error(`No candidates returned for industry: ${industry}`);
        continue;
      }
      const candidate = res.response.candidates[0];
      const textPart = candidate.content?.parts?.find(
        (part) => "text" in part && part.text
      );
      if (!textPart || !("text" in textPart)) {
        console.error(`No text content returned for industry: ${industry}`);
        continue;
      }
      const text = textPart.text;
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      const insights = JSON.parse(cleanedText);
      await step.run(`Update ${industry} insights`, async () => {
        await prisma.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
