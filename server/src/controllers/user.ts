
import { PrismaClient } from "@prisma/client";
import {  Response} from "express";
import { clerkClient } from '@clerk/clerk-sdk-node';
import { generateAIInsights } from "./industryInsight";

const prisma = new PrismaClient();


export const checkUser = async (req: any, res: Response): Promise<void> => {
  try {
     const clerkUser = await clerkClient.users.getUser(req.auth?.userId);
    if (!clerkUser) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id } 
    });

    if (existingUser) {
      res.status(200).json({
        message: "User profile retrieved successfully",
        user: existingUser
      });
      return;
    }

    const name = `${clerkUser.firstName} ${clerkUser.lastName}`;
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name: name,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0].emailAddress
      }
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    console.error("Error creating User", error);
    res.status(500).json({ message: "Error creating User" });
  }
};


export const updateUserProfile = async(req:any,res:Response): Promise<void> => {
  const {industry,experience,bio,skills} = req.body;
  try {
    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {clerkUserId:clerkUser.id}, 
      include: {industryInsight:true}
    });
    if(!user){
      res.status(404).json({message: "User not found"});
      return;
    }
    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>)=>{
      let industryInsight = await tx.industryInsight.findUnique({
        where:{
          industry: industry
        }
      })
      if(!industryInsight){
        const insights = await generateAIInsights(industry);
        industryInsight = await tx.industryInsight.create({
          data: {
            industry:industry,
            ...insights,
            demandLevel: insights.demandLevel.toUpperCase(),
            marketOutlook: insights.marketOutlook.toUpperCase(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 )
          }
        })
      }
      const updatedUser = await tx.user.update({
        where:{
          id: user.id
        },
        data: {
          industry: industry,
          experience: experience,
          bio: bio,
          skills: skills,
        }
      })
      return {updatedUser, industryInsight}
    },{timeout: 10000})
    res.status(200).json({message:"User profile update Successfully"})
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update profile"});
  }
}

export async function getUserOnboardingStatus(req: any, res: Response) {
  try {

   

    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    
    if (!clerkUser) {
      res.status(401).json({ message: "User not found in Clerk" });
      return 
    }

    // Single database query to get user with industry field
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser.id
      },
      select: {
        industry: true,
      }
    });

    if (!user) {
      res.status(404).json({ message: "User not found in database" });
       return
    }
     res.status(200).json({
      isOnboarded: !!user.industry,
    });
    return

  } catch (error: any) {
    console.error("Error getting user onboarding status:", error.message);
    res.status(500).json({  message: "Failed to get user onboarding status"});
    
  }
}

