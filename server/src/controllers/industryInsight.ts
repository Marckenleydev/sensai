
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { clerkClient } from '@clerk/clerk-sdk-node';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
})

export const generateAIInsights = async(industry:string)=>{

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

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text =  response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        return JSON.parse(cleanedText);

}


export async function getIndustryInsight(req: any, res: Response){

  try {
        const clerkUser = await clerkClient.users.getUser(req.auth.userId);
          if (!clerkUser) {
            res.status(401).json({ message: "User not authenticated" });
            return;
          }
       
        const user = await prisma.user.findUnique({
            where:{
                clerkUserId: clerkUser.id
            }, include:{
              industryInsight:true
            }
        })
        if(!user){
            throw new Error("User not found");
        }
          if (!user.industry) {
             res.status(400).json({ message: "User industry not set" });
             return;
           }

        if(!user.industryInsight){
            const insights = await generateAIInsights(user.industry);
            const industryInsight = await prisma.industryInsight.create({
                data:{
                    industry: user.industry,
                    ...insights,
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }
            })
            res.status(200).json(industryInsight);
            
        }

        res.status(200).json(user.industryInsight);
         } catch (error:any) {
    console.error("Error getting industryInsight:", error.message);
    res.status(500).json({ message: "Failed to get industryInsight"});
  }
    
}

