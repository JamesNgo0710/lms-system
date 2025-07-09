import { apiClient } from '@/lib/api-client';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  isAnswered: boolean;
  isPinned: boolean;
  status: 'active' | 'closed' | 'archived';
  replyCount: number;
  isLikedByUser?: boolean;
  replies?: CommunityReply[];
}

export interface CommunityReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isAcceptedAnswer: boolean;
  parentReplyId?: string;
  isLikedByUser?: boolean;
  childReplies?: CommunityReply[];
}

export interface CommunityStats {
  totalPosts: number;
  totalReplies: number;
  totalUsers: number;
  answeredRate: number;
  topCategories: { name: string; count: number }[];
  topContributors: { id: string; name: string; posts: number; replies: number; reputation: number }[];
}

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

export interface CreateReplyData {
  postId: string;
  content: string;
  parentReplyId?: string;
}

export class CommunityService {
  
  // Posts
  static async getPosts(): Promise<CommunityPost[]> {
    try {
      const response = await apiClient.get('/community/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async getPost(id: string): Promise<CommunityPost> {
    try {
      const response = await apiClient.get(`/community/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  static async createPost(data: CreatePostData): Promise<CommunityPost> {
    try {
      const response = await apiClient.post('/community/posts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  static async updatePost(id: string, updates: Partial<CommunityPost>): Promise<CommunityPost> {
    try {
      const response = await apiClient.put(`/community/posts/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  static async deletePost(id: string): Promise<void> {
    try {
      await apiClient.delete(`/community/posts/${id}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  static async togglePostLike(id: string): Promise<{ liked: boolean; totalLikes: number }> {
    try {
      const response = await apiClient.post(`/community/posts/${id}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw error;
    }
  }

  // Replies
  static async getRepliesByPost(postId: string): Promise<CommunityReply[]> {
    try {
      const response = await apiClient.get(`/community/posts/${postId}/replies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  }

  static async createReply(data: CreateReplyData): Promise<CommunityReply> {
    try {
      const response = await apiClient.post('/community/replies', data);
      return response.data;
    } catch (error) {
      console.error('Error creating reply:', error);
      throw error;
    }
  }

  static async updateReply(id: string, content: string): Promise<CommunityReply> {
    try {
      const response = await apiClient.put(`/community/replies/${id}`, { content });
      return response.data;
    } catch (error) {
      console.error('Error updating reply:', error);
      throw error;
    }
  }

  static async deleteReply(id: string): Promise<void> {
    try {
      await apiClient.delete(`/community/replies/${id}`);
    } catch (error) {
      console.error('Error deleting reply:', error);
      throw error;
    }
  }

  static async toggleReplyLike(id: string): Promise<{ liked: boolean; totalLikes: number }> {
    try {
      const response = await apiClient.post(`/community/replies/${id}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling reply like:', error);
      throw error;
    }
  }

  static async markReplyAsAccepted(id: string): Promise<void> {
    try {
      await apiClient.post(`/community/replies/${id}/accept`);
    } catch (error) {
      console.error('Error marking reply as accepted:', error);
      throw error;
    }
  }

  // Stats
  static async getStats(): Promise<CommunityStats> {
    try {
      const response = await apiClient.get('/community/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching community stats:', error);
      throw error;
    }
  }

  // Helper methods
  static hasUserLikedPost(post: CommunityPost): boolean {
    return post.isLikedByUser || false;
  }

  static hasUserLikedReply(reply: CommunityReply): boolean {
    return reply.isLikedByUser || false;
  }

  static incrementPostViews(postId: string): void {
    // This is handled automatically by the API when fetching a post
    // No need for manual increment on frontend
  }
} 