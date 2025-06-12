"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const industryInsight_1 = require("../controllers/industryInsight");
const interview_1 = require("../controllers/interview");
const resume_1 = require("../controllers/resume");
const cover_letter_1 = require("../controllers/cover-letter");
const router = express_1.default.Router();
router.post("/profile", user_1.checkUser);
router.put("/industry", user_1.updateUserProfile);
router.get("/onboarding-status", user_1.getUserOnboardingStatus);
router.get("/industry-insight", industryInsight_1.getIndustryInsight);
{ /* This endpoint is used to save the user's quiz result */ }
router.post("/generate-quiz", interview_1.generateQuiz);
router.post("/save-quiz", interview_1.saveQuizResult);
router.get("/assessment", interview_1.getAssessment);
{ /* This endpoint is used to save the user's resume */ }
router.post("/save-resume", resume_1.saveResume);
router.get("/my-resume", resume_1.getResume);
router.post("/improve-with-ai", resume_1.improveWithAI);
{ /* This endpoint is used to generate a cover letter based on the user's resume and job description */ }
router.post("/generate-cover-letter", cover_letter_1.generateCoverLetter);
router.get("/cover-letters", cover_letter_1.getCoverLetters);
router.get("/cover-letter/:id", cover_letter_1.getCoverLetter);
router.delete("/cover-letter/:id", cover_letter_1.deleteCoverLetter);
exports.default = router;
