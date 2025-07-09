import { apiClient } from '@/lib/api-client';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_image?: string;
  joined_date: string;
  completed_topics: number;
  total_topics: number;
  weekly_hours: number;
  this_week_hours: number;
}

export const userService = {
  // Get all users (admin only)
  async getAll(): Promise<User[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Get single user
  async getById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create new user (admin only)
  async create(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Update user
  async update(id: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  // Update password
  async updatePassword(
    id: string,
    password: string,
    password_confirmation: string
  ): Promise<void> {
    await apiClient.put(`/users/${id}/password`, {
      password,
      password_confirmation,
    });
  },

  // Upload profile image
  async updateProfileImage(id: string, imageData: string): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, {
      profile_image: imageData,
    });
    return response.data;
  },
}; 