import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function saveResume(req: any, res: Response) {
        const { content } = req.body;

   
  try {
     if (!content || typeof content !== "string") {
      res.status(400).json({ message: "Invalid resume content" });
      return;
    }

     const clerkUser = await clerkClient.users.getUser(req.auth.userId);
        if (!clerkUser) {
          res.status(401).json({ message: "User not authenticated" });
          return;
        }
    
        const user = await prisma.user.findUnique({
          where: {
            clerkUserId: clerkUser.id,
          }
        });
        if (!user) {
          res.status(401).json({ message: "User not found" });
          return;
        }

            const resume = await prisma.resume.upsert({
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
    res.status(201).json(resume)
    return ;

  } catch (error:any) {
      console.error("Error savingResume:", error.message);
    res.status(500).json({ message: "Failed to save resume" });
  }
}

export async function getResume(req: any, res: Response) {
    try {
        const clerkUser = await clerkClient.users.getUser(req.auth.userId);
        if (!clerkUser) {
          res.status(401).json({ message: "User not authenticated" });
          return;
        }

        const user = await prisma.user.findUnique({
          where: {
            clerkUserId: clerkUser.id,
          }
        });
        if (!user) {
          res.status(401).json({ message: "User not found" });
          return;
        }

       const resume = await prisma.resume.findUnique({where:{userId:user.id}})
       res.status(200).json(resume)
       return;

    } catch (error:any) {
         console.error("Error gettiningResume:", error.message);
    res.status(500).json({ message: "Failed to get resume" });
    }
}


export async function improveWithAI(req: any, res: Response) {
    const { current, type } = req.body
    try {
        
   
  const clerkUser = await clerkClient.users.getUser(req.auth.userId);
        if (!clerkUser) {
          res.status(401).json({ message: "User not authenticated" });
          return;
        }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

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


    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    res.status(200).json(improveWithAI)
    return ;
  } catch (error:any) {
    console.error("Error improving content:", error.message);
     res.status(500).json("Failed to improve content");
  }
}