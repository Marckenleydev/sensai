import { UserPlus, FileEdit, Users, LineChart, LucideIcon } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const howItWorks: Step[] = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
    icon: UserPlus,
  },
  {
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes and compelling cover letters",
    icon: FileEdit,
  },
  {
    title: "Prepare for Interviews",
    description: "Practice with AI-powered mock interviews tailored to your role",
    icon: Users,
  },
  {
    title: "Track Your Progress",
    description: "Monitor improvements with detailed performance analytics",
    icon: LineChart,
  },
];
