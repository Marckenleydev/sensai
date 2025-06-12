"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
 
import QuizResult from "./quiz-result";
import { BarLoader } from "react-spinners";
import { useGenerateQuiz, useSaveQuizResult } from "@/app/hook/useCheckUser";
import { QuizSubmission } from "@/lib/types";
import { Loader2 } from "lucide-react";


export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false); 
   

  const {
    generateQuiz,
    resetQuiz, 
    quiz: quizData,
    loading: generatingQuiz,
    error: quizError,
  } = useGenerateQuiz();

  const {
    saveQuizResult,
    result: resultData,
    loading: savingResult,
    error: saveError,
  } = useSaveQuizResult();

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(""));
      setCurrentQuestion(0); // Reset to first question
      setShowExplanation(false); // Reset explanation state
    }
  }, [quizData]);

  useEffect(() => {
    if (quizError) {
      toast.error(quizError);
    }
  }, [quizError]);

  useEffect(() => {
    if (saveError) {
      toast.error(saveError);
    }
  }, [saveError]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = (): number => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    const quizSubmission: QuizSubmission = {
      questions: quizData,
      answers,
      score,
    };
    
    try {
      await saveQuizResult(quizSubmission);
      setShowResults(true); // Show results after successful save
      toast.success("Quiz completed!");
    } catch  {
      toast.error("Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    // Reset all state first
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setShowResults(false); // Hide results
    
    // Then reset quiz data and generate new quiz
    resetQuiz(); // Reset quiz data to null first
    generateQuiz(); // Then generate new quiz
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // Show results if quiz is completed
  if (showResults && resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData ) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
          {savingResult ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            currentQuestion < quizData.length - 1
              ? "Next Question"
              : "Finish Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}


