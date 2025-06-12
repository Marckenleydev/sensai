import { GenerateCoverLetterRequest, ImproveContent, ProfileData, QuizSubmission, SaveResumeData } from "./types";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient ={

    async checkUser (token:string){
        try {
                  const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
     
        if (!response.ok) {
        throw new Error('Failed to sync user');
      }

      return await response.json();
        } catch (error) {
              console.error('Error syncing user:', error);
              throw error;
        }
    },


    async updateUserProfile(token: string, profileData:ProfileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/industry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },



    async getUserOnboardingStatus(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/onboarding-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get user onboarding status: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error onboarding status:', error);
      throw error;
    }
  },

     async getIndustryInsight(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/industry-insight`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get IndustryInsight: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error geting IndustryInsight:', error);
      throw error;
    }
  },

   async generateQuiz(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate Quiz: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating Quiz:', error);
      throw error;
    }
  },



    async saveQuizResult(token: string, quizData:QuizSubmission) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/save-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to saveQuiz Result: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving QuizResult:', error);
      throw error;
    }
  },

  async getAssessment(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/assessment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async saveResume(token:string,content:SaveResumeData){
        try {
      const response = await fetch(`${API_BASE_URL}/user/save-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save Resume: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error savingResume:', error);
      throw error;
    }
  },

   async getMyResume(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/my-resume`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get MyResume: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error geting MyResume:', error);
      throw error;
    }
  },

    async improveWithAI(token:string,content:ImproveContent){
        try {
      const response = await fetch(`${API_BASE_URL}/user/improve-with-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to improve My resume WithAI: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error improving my resume WithAI:', error);
      throw error;
    }
  },

  async generateCoverLetter(token: string, content: GenerateCoverLetterRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/generate-cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate cover letter: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  },

  async getCoverLetters(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/cover-letters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get cover letters: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting cover letters:', error);
      throw error;
    }
  },

  async getCoverletter(token: string, coverLetterId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/cover-letter/${coverLetterId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`

           }
      });

       if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get cover letters: ${errorText}`);
      }

      return await response.json();

 } catch (error) {
      console.error('Error getting cover letters:', error);
      throw error;
    }
  },

  async deleteCoverLetter(token: string, coverLetterId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/cover-letter/${coverLetterId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
                 }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete cover letter: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      throw error;
  }
}

}