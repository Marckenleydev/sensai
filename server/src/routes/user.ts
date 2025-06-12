import express from "express"
import { checkUser, getUserOnboardingStatus, updateUserProfile } from "../controllers/user";
import { getIndustryInsight } from "../controllers/industryInsight";
import { generateQuiz, getAssessment, saveQuizResult } from "../controllers/interview";
import { getResume, improveWithAI, saveResume } from "../controllers/resume";
import { deleteCoverLetter, generateCoverLetter, getCoverLetter, getCoverLetters } from "../controllers/cover-letter";

const router = express.Router()
router.post("/profile",checkUser);
router.put("/industry",updateUserProfile);
router.get("/onboarding-status",getUserOnboardingStatus);
router.get("/industry-insight",getIndustryInsight);
{ /* This endpoint is used to save the user's quiz result */ }
router.post("/generate-quiz",generateQuiz);
router.post("/save-quiz",saveQuizResult);
router.get("/assessment",getAssessment);
{ /* This endpoint is used to save the user's resume */ }
router.post("/save-resume",saveResume);
router.get("/my-resume",getResume);
router.post("/improve-with-ai",improveWithAI);

{ /* This endpoint is used to generate a cover letter based on the user's resume and job description */ }
router.post("/generate-cover-letter", generateCoverLetter);
router.get("/cover-letters", getCoverLetters);
router.get("/cover-letter/:id", getCoverLetter);
router.delete("/cover-letter/:id", deleteCoverLetter);




export default router;
