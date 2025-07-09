import { apiClient } from '@/lib/api-client';

export interface Question {
  id: number;
  type: 'true-false' | 'multiple-choice';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  image?: string;
  order: number;
  userAnswer?: string | number;
  isCorrect?: boolean;
}

export interface Assessment {
  id: number;
  topicId: number;
  totalQuestions: number;
  timeLimit: string;
  retakePeriod: string;
  cooldownPeriod: number;
  questions: Question[];
  createdAt: string;
  canTake?: boolean;
  timeRemaining?: number;
  message?: string;
  lastAttempt?: AssessmentAttempt;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentId: number;
  topicId: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
  answers: (string | number)[];
  questionsWithResults?: Question[];
}

export interface SubmitAssessmentData {
  answers: (string | number)[];
  timeSpent: number;
}

export class AssessmentService {
  
  static async getAssessments(): Promise<Assessment[]> {
    try {
      const response = await apiClient.get('/assessments');
      return response.data;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }

  static async getAssessment(id: number): Promise<Assessment> {
    try {
      const response = await apiClient.get(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      throw error;
    }
  }

  static async getAssessmentByTopic(topicId: number): Promise<Assessment> {
    try {
      const response = await apiClient.get(`/topics/${topicId}/assessment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment by topic:', error);
      throw error;
    }
  }

  static async createAssessment(assessment: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> {
    try {
      const response = await apiClient.post('/assessments', assessment);
      return response.data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  static async updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment> {
    try {
      const response = await apiClient.put(`/assessments/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  }

  static async deleteAssessment(id: number): Promise<void> {
    try {
      await apiClient.delete(`/assessments/${id}`);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }

  static async submitAssessment(assessmentId: number, data: SubmitAssessmentData): Promise<AssessmentAttempt> {
    try {
      const response = await apiClient.post(`/assessments/${assessmentId}/submit`, data);
      return response.data;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }

  static async getUserAttempts(assessmentId: number): Promise<AssessmentAttempt[]> {
    try {
      const response = await apiClient.get(`/assessments/${assessmentId}/attempts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user attempts:', error);
      throw error;
    }
  }

  static async getAttemptResults(assessmentId: number, attemptId: string): Promise<AssessmentAttempt> {
    try {
      const response = await apiClient.get(`/assessments/${assessmentId}/attempts/${attemptId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attempt results:', error);
      throw error;
    }
  }

  // Helper method to check if user can take assessment
  static canUserTakeAssessment(assessment: Assessment): { canTake: boolean; timeRemaining?: number; message?: string } {
    if (!assessment.canTake) {
      return {
        canTake: false,
        timeRemaining: assessment.timeRemaining,
        message: assessment.message || 'Cannot take assessment at this time'
      };
    }
    return { canTake: true };
  }

  // Helper method to format cooldown time
  static formatCooldownTime(timeMs: number): string {
    const hours = Math.floor(timeMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeMs % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
} 