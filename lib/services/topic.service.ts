import { apiClient } from '@/lib/api-client';

export interface Topic {
  id: number;
  title: string;
  category: string;
  status: 'Published' | 'Draft';
  students: number;
  lessons: number;
  createdAt: string;
  hasAssessment: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description?: string;
  image?: string;
}

export interface TopicStudentDetails {
  totalStudents: number;
  studentsWithViews: number;
  studentsWithCompletions: number;
  studentsWithAssessments: number;
  studentsList: {
    id: string;
    name: string;
    hasViewed: boolean;
    hasCompleted: boolean;
    hasAttemptedAssessment: boolean;
  }[];
}

export class TopicService {
  
  static async getTopics(): Promise<Topic[]> {
    try {
      const response = await apiClient.get('/topics');
      return response.data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  }

  static async getTopic(id: number): Promise<Topic> {
    try {
      const response = await apiClient.get(`/topics/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching topic:', error);
      throw error;
    }
  }

  static async createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'students' | 'lessons'>): Promise<Topic> {
    try {
      const response = await apiClient.post('/topics', topic);
      return response.data;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }

  static async updateTopic(id: number, updates: Partial<Topic>): Promise<Topic> {
    try {
      const response = await apiClient.put(`/topics/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  }

  static async deleteTopic(id: number): Promise<void> {
    try {
      await apiClient.delete(`/topics/${id}`);
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  }

  static async getTopicStudentDetails(id: number): Promise<TopicStudentDetails> {
    try {
      const response = await apiClient.get(`/topics/${id}/students`);
      return response.data;
    } catch (error) {
      console.error('Error fetching topic student details:', error);
      throw error;
    }
  }
} 