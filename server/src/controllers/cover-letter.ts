import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { clerkClient } from '@clerk/clerk-sdk-node';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
})

export async function generateCoverLetter(req: any, res: Response) {
     const { jobTitle, companyName, jobDescription } = req.body; 
  try {
   

    if (!jobTitle || !companyName || !jobDescription) {
      res.status(400).json({ message: "Missing required fields" });
      return ;
    }

     const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
       res.status(401).json({ message: "User not authenticated" });
       return;
    }

    const user = await prisma.user.findUnique({
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
- Skills: ${user.skills?.join(", ")}
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

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await prisma.coverLetter.create({
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

  } catch (error: any) {
    console.error("Error generating cover letter:", error.message);
    res.status(500).json({ message: "Failed to generate cover letter" });
  }
}



export async function getCoverLetters(req: any, res: Response) {
      try {
 const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
       res.status(401).json({ message: "User not authenticated" });
       return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id }
    });

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

  const coverLetter= await prisma.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json(coverLetter);
 

    
  } catch (error: any) {
    console.error("Error getting cover letters:", error.message);
   res.status(500).json({ message: "Failed to get cover letters" });
    
  }
}


export async function getCoverLetter(req: any, res: Response) {
    try {
    const { id } = req.params;
    if (!id) {
       res.status(400).json({ message: "Cover letter ID is required" });
       return;
    }
    
   const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
       res.status(401).json({ message: "User not authenticated" });
       return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id }
    });

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

  const coverLetter= await prisma.coverLetter.findUnique({
    where: {
      id:id,
      userId: user.id,
    },
  });
  res.status(200).json(coverLetter);
  } catch (error:any) {
    console.error("Error getting cover letter:", error.message);
    res.status(500).json({ message: "Failed to get cover letter" });
        
    }
}


export async function deleteCoverLetter(req: any, res: Response) {
    try {
  const { id } = req.params;
    if (!id) {
       res.status(400).json({ message: "Cover letter ID is required" });
       return;
    }
    
   const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
       res.status(401).json({ message: "User not authenticated" });
       return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id }
    });

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

 await prisma.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
    res.status(200).json({ message: "Cover letter deleted successfully" });
    
  } catch (error:any) {
    console.error("Error deleting cover letter:", error.message);
    res.status(500).json({ message: "Failed to delete cover letter" });
        
    }
}