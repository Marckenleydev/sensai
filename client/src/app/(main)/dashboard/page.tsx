"use client"
import { useGetIndustryInsight, useGetUserOnboardingStatus } from '@/app/hook/useCheckUser';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { redirect } from 'next/navigation';
import DashboardView from './_components/dashboard-view';

function IndustryInsightPage() {
  const router = useRouter();
  const { isOnboarded, checkOnboardingStatus } = useGetUserOnboardingStatus();
  const { industryInsight, getIndustryInsight } = useGetIndustryInsight();
  
  console.log(industryInsight !== null ? industryInsight : "No industry insight data");

  useEffect(() => {
    checkOnboardingStatus();
    getIndustryInsight(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOnboarded === false) {
      redirect('/onboarding');
    }
  }, [isOnboarded, router]);


  if (!industryInsight) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="">Loading industry insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
  
      <DashboardView industryInsight={industryInsight} />
    </div>
  );
}

export default IndustryInsightPage;