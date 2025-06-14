

export type ProfileData = {
    industry: string;
    experience: number;
    bio: string;
    skills: string[];
}

export type DatabaseUser = {
  id: string;
  clerkUserId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type FormData ={
  industry: string;
  subIndustry: string;
  experience: number;
  skills: string | string[]; // Allow both string and array
  bio: string;
}

export type Industry ={
  id: string;
  name: string;
  subIndustries: string[];
}


export type IndustryInsight = {
  id: string;
  industry: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users?: any[];
  salaryRanges: salaryRange[];
  growthRate: number;
  demandLevel: DemandLevel;        // Fixed: was MarketOutlook
  topSkills: string[];
  marketOutlook: MarketOutlook;    // Fixed: was DemandLevel
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: string;
  nextUpdate: string;
};
export type salaryRange={
  
    name: string;
    min: number;
    max: number;
    median: number;
    location?: string;
  
}
export enum DemandLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum MarketOutlook {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

export interface IUpdateResponse {
  success: boolean;
  user?: DatabaseUser;
  error?: string;
}



export type QuizQuestion ={
 question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type QuizSubmission ={
  questions: QuizQuestion[];
  answers: string[];
  score: number;
}

export type quizResult ={
   
    quizScore: number;
    improvementTip?: string;
    questions: {
      question: string;
      userAnswer: string;
      answer: string;
      isCorrect: boolean;
      explanation: string;
    
}
}

export interface Assessment {
  id: string;
  userId: string;
  quizScore: number;
  questions: {
    question: string;
    answer: string;
    userAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  category: string; 
  improvementTip?: string;
  createdAt: string; 
  updatedAt: string; 
}

export type ImproveContent={
  content:string,
  type:string
}

export type ContactInfo ={
  email: string;
  mobile?: string;
  linkedin?: string;
  twitter?: string;
}

export type Entry ={
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
  current?: boolean;
}

export type ResumeFormData ={
  contactInfo: ContactInfo;
  summary: string;
  skills: string;
  experience: Entry[];
  education: Entry[];
  projects: Entry[];
}

export type ResumeBuilderProps ={
  initialContent?: string;
}

export type SaveResumeData ={
  content: string;
  title?: string;
  updatedAt?: string;
}

export type GenerateCoverLetterRequest= {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}

export type CoverLetter= {
  id: string;
  content: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}