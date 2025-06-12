"use client"

import { industries } from '@/app/data/industries';
import React, { useEffect } from 'react';
import OnboardingForm from './_component/OnboardingForm';
import { useRouter } from 'next/navigation';
import { useGetUserOnboardingStatus } from '@/app/hook/useCheckUser';

const OnboardingPage = () => {
  const router = useRouter();
  const { isOnboarded, loading, checkOnboardingStatus } = useGetUserOnboardingStatus();

  useEffect(() => {
    checkOnboardingStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle redirect when onboarding status is determined
  useEffect(() => {
    if (isOnboarded === true) {
      router.push('/dashboard');
    }
  }, [isOnboarded, router]);




 if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Checking your onboarding status...</p>
        </div>
      </div>
    );
  }

return (
      <div>
        <OnboardingForm industries={industries} />
      </div>
    );
  

  
    
  

  
};

export default OnboardingPage;