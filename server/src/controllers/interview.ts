import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function generateQuiz(req: any, res: Response) {
  try {
    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await prisma.user.findUnique({
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
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    res.status(201).json(quiz.questions);
    return;
  } catch (error: any) {
    console.error("Error generatingQuiz status:", error.message);
    res.status(500).json({ message: "Failed to generateQuiz" });
  }
}

export async function saveQuizResult(req: any, res: Response) {
  const { questions, answers, score } = req.body;
  

  try {
    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const questionResults = questions.map((q:any, index:any) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    }));

     // Get wrong answers
  const wrongAnswers = questionResults.filter((q:any) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q:any) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
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
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    res.status(201).json(assessment) ;
  } catch (error:any) {
     console.error("Error save Quiz status:", error.message);
    res.status(500).json({ message: "Failed to save Quiz" });
  }
}


export async function getAssessment(req: any, res: Response){
  try {
     const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const assessments = await prisma.assessment.findMany({where:{userId:user.id},orderBy:{createdAt:"asc"}})
    res.status(200).json(assessments)
  } catch (error:any) {
      console.error("Error getting Assessment:", error.message);
    res.status(500).json({ message: "Failed to get Assessment" });
  }
}