import { apiClient } from '@/lib/api-client';

export interface Lesson {
  id: number;
  topicId: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl?: string;
  prerequisites: string[];
  content: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    youtube?: string;
    instagram?: string;
  };
  downloads: {
    id: number;
    name: string;
    size: string;
    url: string;
  }[];
  order: number;
  status: 'Published' | 'Draft';
  createdAt: string;
  image?: string;
  isCompleted?: boolean;
  completion?: LessonCompletion;
}

export interface LessonCompletion {
  id: string;
  userId: string;
  lessonId: number;
  topicId: number;
  completedAt: string;
  timeSpent?: number;
}

export interface LessonView {
  id: string;
  userId: string;
  lessonId: number;
  topicId: number;
  viewedAt: string;
  duration?: number;
}

export class LessonService {
  
  static async getLessons(): Promise<Lesson[]> {
    try {
      const response = await apiClient.get('/lessons');
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  }

  static async getLesson(id: number): Promise<Lesson> {
    try {
      const response = await apiClient.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  }

  static async getLessonsByTopic(topicId: number): Promise<Lesson[]> {
    try {
      const response = await apiClient.get(`/topics/${topicId}/lessons`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons by topic:', error);
      throw error;
    }
  }

  static async createLesson(lesson: Omit<Lesson, 'id' | 'createdAt'>): Promise<Lesson> {
    try {
      const response = await apiClient.post('/lessons', lesson);
      return response.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  static async updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson> {
    try {
      const response = await apiClient.put(`/lessons/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  static async deleteLesson(id: number): Promise<void> {
    try {
      await apiClient.delete(`/lessons/${id}`);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }

  static async markLessonComplete(lessonId: number, timeSpent?: number): Promise<LessonCompletion> {
    try {
      const response = await apiClient.post(`/lessons/${lessonId}/complete`, {
        time_spent: timeSpent
      });
      return response.data;
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      throw error;
    }
  }

  static async markLessonIncomplete(lessonId: number): Promise<void> {
    try {
      await apiClient.delete(`/lessons/${lessonId}/complete`);
    } catch (error) {
      console.error('Error marking lesson incomplete:', error);
      throw error;
    }
  }

  static async trackLessonView(lessonId: number, duration?: number): Promise<LessonView> {
    try {
      const response = await apiClient.post(`/lessons/${lessonId}/view`, {
        duration
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking lesson view:', error);
      throw error;
    }
  }
} 