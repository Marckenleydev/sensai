"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
 // Adjust path as needed
import CoverLetterPreview from "../_components/cover-letter-preview";
import { useGetCoverLetter } from "@/app/hook/useCheckUser";

export default function EditCoverLetterPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { getCoverLetter, coverLetter, loading, error } = useGetCoverLetter();

  useEffect(() => {
    if (id) {
      getCoverLetter(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading cover letter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-2">
          <Link href="/ai-cover-letter">
            <Button variant="link" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Cover Letters
            </Button>
          </Link>
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => getCoverLetter(id)} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!coverLetter) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-2">
          <Link href="/ai-cover-letter">
            <Button variant="link" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Cover Letters
            </Button>
          </Link>
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <p className="text-muted-foreground">Cover letter not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>
        <h1 className="text-6xl font-bold gradient-title mb-6">
          {coverLetter.jobTitle} at {coverLetter.companyName}
        </h1>
      </div>
      <CoverLetterPreview content={coverLetter.content} />
    </div>
  );
}