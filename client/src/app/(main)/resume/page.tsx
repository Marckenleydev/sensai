"use client";

import { useEffect } from "react"; // Adjust import path as needed
import ResumeBuilder from "./_components/resume-builder";
import { useGetMyResume } from "@/app/hook/useCheckUser";

export default function ResumePage() {
  const { getMyResume, myResume, loading, error } = useGetMyResume();

  useEffect(() => {
    getMyResume();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-32">
          <div className="text-lg">Loading resume...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-32">
          <div className="text-red-500">Error loading resume: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={(myResume as any)?.content} />
    </div>
  );
}