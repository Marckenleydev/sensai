"use client"
import React, { useEffect } from 'react';
import { useGetAssessment } from '@/app/hook/useCheckUser'; // Adjust the import path as needed
import StatsCards from './_components/stats-cards';
import PerformanceChart from './_components/performance-chart';
import QuizList from './_components/quiz-list';

const InterviewPage = () => {
  const {
    getAssessment,
    assessments,
    loading,
    error
  } = useGetAssessment();

  // Fetch assessment data when component mounts
  useEffect(() => {
    getAssessment();

  }, []);

  // Handle loading state
  if (loading) {
    return (
       <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="">Loading assessment data...</p>
        </div>
      </div>
     
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
      
        
        
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
       
      </div>
    </div>
  );
};

export default InterviewPage;