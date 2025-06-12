"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteCoverLetter } from "@/app/hook/useCheckUser";


interface CoverLetter {
  id: string;
  jobTitle: string;
  companyName: string;
  createdAt: string | Date;
  jobDescription: string;
}

interface CoverLetterListProps {
  coverLetters: CoverLetter[];
}

export default function CoverLetterList({ coverLetters }: CoverLetterListProps) {
  const router = useRouter();
  const { deleteCoverLetter, loading, error } = useDeleteCoverLetter();

  const handleDelete = async (id: string): Promise<void> => {
    const result = await deleteCoverLetter(id);
    if (result) {
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } else if (error) {
      toast.error(error);
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No Cover Letters Yet</h3>
            <p className="text-muted-foreground">
              Create your first cover letter to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {coverLetters.map((letter) => (
        <Card key={letter.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">
                  {letter.jobTitle} at {letter.companyName}
                </CardTitle>
                <CardDescription>
                  Created {format(new Date(letter.createdAt), "PPP")}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/ai-cover-letter/${letter.id}/edit`)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your cover letter for {letter.jobTitle} at{" "}
                        {letter.companyName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(letter.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {letter.jobDescription}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}