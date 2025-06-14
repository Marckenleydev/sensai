/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useAuth,useUser } from "@clerk/nextjs";
import { useState,useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Assessment, CoverLetter, DatabaseUser, GenerateCoverLetterRequest, ImproveContent, IndustryInsight, IUpdateResponse, ProfileData, QuizSubmission, SaveResumeData } from "@/lib/types";


export const useCheckUser = () => {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const token = await getToken();
        
        if (!token) {
          throw new Error('No authentication token');
        }
      
        const response = await apiClient.checkUser(token);
        setDbUser(response.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to sync user');
        console.error('Error syncing user:', err);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [user, isLoaded, getToken]);

  return { dbUser, loading, error, isLoaded };
};






export const useUpdateProfile = () => {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IUpdateResponse | null>(null);

  const updateProfile = async (profileData: ProfileData): Promise<IUpdateResponse |null> => {
    if (!isLoaded || !user) return null;
    
    setLoading(true);
    setError(null);
    setData(null); // Reset data on new request
    
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      const response = await apiClient.updateUserProfile(token, profileData);
      
      setDbUser(response.user);
      setData({ success: true, user: response.user }); // Set success data
      
      return { success: true, user: response.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      setData({ success: false, error: errorMessage });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { 
    updateProfile, 
    dbUser, 
    loading, 
    error,
    data 
  };
};


export const useGetUserOnboardingStatus = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  const checkOnboardingStatus = async (): Promise<{ isOnboarded: boolean } | null> => {
 
    setLoading(true);
    setError(null); 
     console.log(await getToken())

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      const response = await apiClient.getUserOnboardingStatus(token);
      console.log(response)
      setIsOnboarded(response.isOnboarded);
      
      return { isOnboarded: response.isOnboarded };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get onboarding status";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkOnboardingStatus,
    isOnboarded,
    loading,
    error,
  };
};



export const useGetIndustryInsight = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [industryInsight, setIndustryInsight] = useState<IndustryInsight | null>(null);

  const getIndustryInsight = async (): Promise<IndustryInsight | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      console.log('Calling API...');
      const response = await apiClient.getIndustryInsight(token);
      console.log('API response:', response);
      
      // Make sure we're setting the state correctly
      setIndustryInsight(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get industry insight";
      console.error('Hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getIndustryInsight,
    industryInsight, // Make sure this is the correct name
    loading,
    error,
  };
};


export const useGenerateQuiz = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<any | null>(null); // Replace 'any' with your Quiz type

  const generateQuiz = async (): Promise<any | null> => { // Replace 'any' with your Quiz type
    setLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      console.log('Calling generateQuiz API...');
      const response = await apiClient.generateQuiz(token);
      console.log('generateQuiz API response:', response);
      
      setQuiz(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate quiz";
      console.error('generateQuiz hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setError(null);
    setLoading(false);
  };

  return {
    generateQuiz,
    resetQuiz,
    quiz,
    loading,
    error,
  };
};

export const useSaveQuizResult = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null); // Replace 'any' with your save result type

  const saveQuizResult = async (quizData: QuizSubmission): Promise<any | null> => { // Replace 'any' with your save result type
    setLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      console.log('Calling saveQuizResult API...');
      const response = await apiClient.saveQuizResult(token, quizData);
      console.log('saveQuizResult API response:', response);
      
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save quiz result";
      console.error('saveQuizResult hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveQuizResult,
    result,
    loading,
    error,
  };
};

export const useGetAssessment = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);

  const getAssessment = async (): Promise<Assessment[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      console.log('Calling API...');
      const response = await apiClient.getAssessment(token);
      console.log('API response:', response);
      
      // Make sure we're setting the state correctly
      setAssessments(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get Assessment";
      console.error('Hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAssessment,
    assessments, // Make sure this is the correct name
    loading,
    error,
  };
};

// Hook for saving resume
export const useSaveResume = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedResume, setSavedResume] = useState(null);

  const saveResume = async (content: SaveResumeData): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      console.log('Saving resume...');
      const response = await apiClient.saveResume(token, content);
      console.log('Save resume response:', response);
      
      setSavedResume(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save resume";
      console.error('Save resume hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveResume,
    savedResume,
    loading,
    error,
  };
};

// Hook for getting user's resume
interface Resume {
  content: string; 
  id?: string;
  
}

export const useGetMyResume = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Properly type the myResume state
  const [myResume, setMyResume] = useState<Resume | null>(null);

  const getMyResume = async (): Promise<Resume | null> => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      console.log('Getting my resume...');
      const response = await apiClient.getMyResume(token);
      console.log('Get my resume response:', response);
      
      setMyResume(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get my resume";
      console.error('Get my resume hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getMyResume,
    myResume,
    loading,
    error,
  };
};


export const useImproveWithAI = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [improvedResume, setImprovedResume] = useState(null);

  const improveWithAI = async (content: ImproveContent): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      
      console.log('Improving resume with AI...');
      const response = await apiClient.improveWithAI(token, content);
      console.log('Improve with AI response:', response);
      
      setImprovedResume(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to improve resume with AI";
      console.error('Improve with AI hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    improveWithAI,
    improvedResume,
    loading,
    error,
  };
};

export const useGenerateCoverLetter = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<CoverLetter | null>(null);

  const generateCoverLetter = async (data: GenerateCoverLetterRequest): Promise<CoverLetter | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");

      console.log('Generating cover letter...');
      const response = await apiClient.generateCoverLetter(token, data);
      console.log('Generate cover letter response:', response);
      
      setGeneratedCoverLetter(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate cover letter";
      console.error('Generate cover letter hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateCoverLetter,
    generatedCoverLetter,
    loading,
    error,
  };
};


export const useGetCoverLetters = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);

  const getCoverLetters = async (): Promise<CoverLetter[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");

      console.log('Getting cover letters...');
      const response = await apiClient.getCoverLetters(token);
      console.log('Get cover letters response:', response);
      
      setCoverLetters(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get cover letters";
      console.error('Get cover letters hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCoverLetters,
    coverLetters,
    loading,
    error,
  };
};


export const useGetCoverLetter = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);

  const getCoverLetter = async (id: string): Promise<CoverLetter | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");

      console.log('Getting cover letter...');
      const response = await apiClient.getCoverletter(token, id);
      console.log('Get cover letter response:', response);
      
      setCoverLetter(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get cover letter";
      console.error('Get cover letter hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCoverLetter,
    coverLetter,
    loading,
    error,
  };
};


export const useDeleteCoverLetter = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteResult, setDeleteResult] = useState<{ message: string } | null>(null);

  const deleteCoverLetter = async (id: string): Promise<{ message: string } | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");

      console.log('Deleting cover letter...');
      const response = await apiClient.deleteCoverLetter(token, id);
      console.log('Delete cover letter response:', response);
      
      setDeleteResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete cover letter";
      console.error('Delete cover letter hook error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteCoverLetter,
    deleteResult,
    loading,
    error,
  };
};