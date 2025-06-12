"use client";
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";
import { Assessment } from "@/lib/types";

interface QuizListProps {
  assessments: Assessment[] | null;
}

export default function QuizList({ assessments }: QuizListProps) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);

  const handleQuizSelect = (assessment: Assessment): void => {
    setSelectedQuiz(assessment);
  };

  const handleCloseDialog = (): void => {
    setSelectedQuiz(null);
  };

  const handleStartNewQuiz = (): void => {
    router.push("/interview/mock");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Quizzes
              </CardTitle>
              <CardDescription>
                Review your past quiz performance
              </CardDescription>
            </div>
            <Button onClick={handleStartNewQuiz}>
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!assessments?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                No quizzes taken yet. Start your first quiz!
              </div>
            ) : (
              assessments.map((assessment: Assessment, i: number) => (
                <Card
                  key={assessment.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleQuizSelect(assessment)}
                >
                  <CardHeader>
                    <CardTitle className="gradient-title text-2xl">
                      Quiz {i + 1}
                    </CardTitle>
                    <CardDescription className="flex justify-between w-full">
                      <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                      <div>
                        {format(
                          new Date(assessment.createdAt),
                          "MMMM dd, yyyy HH:mm"
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  {assessment.improvementTip && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {assessment.improvementTip}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Results</DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <QuizResult
              result={selectedQuiz}
              hideStartNew
              onStartNew={handleStartNewQuiz}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}