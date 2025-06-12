"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CoverLetterList from "./_components/cover-letter-list";
import { useGetCoverLetters } from "@/app/hook/useCheckUser";


export default function CoverLetterPage() {
  const {
    getCoverLetters,
    coverLetters,
    loading,
    error,
  } = useGetCoverLetters();

  // Fetch cover letters on component mount
  useEffect(() => {
    getCoverLetters();
  }, []);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div>
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
          <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
          <Link href="/ai-cover-letter/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading cover letters...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/ai-cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>
      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}