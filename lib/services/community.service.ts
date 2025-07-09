import { apiClient } from '../api-client';

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  is_pinned: boolean;
  is_locked: boolean;
  is_hidden: boolean;
  vote_count: number;
  comment_count: number;
  comments_count?: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  user_vote?: CommunityVote;
}

export interface CommunityComment {
  id: number;
  content: string;
  author_id: number;
  author: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  post_id: number;
  parent_id?: number;
  is_hidden: boolean;
  vote_count: number;
  depth: number;
  created_at: string;
  updated_at: string;
  replies?: CommunityComment[];
  user_vote?: CommunityVote;
}

export interface CommunityVote {
  id: number;
  user_id: number;
  voteable_type: string;
  voteable_id: number;
  vote_type: 1 | -1; // 1 for upvote, -1 for downvote
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface CreateCommentData {
  content: string;
  parent_id?: number;
}

export interface VoteData {
  voteable_type: 'post' | 'comment';
  voteable_id: number;
  vote_type: 1 | -1;
}

export interface PostsResponse {
  data: CommunityPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PostFilters {
  search?: string;
  author?: number;
  page?: number;
}

export class CommunityService {
  private static baseUrl = '/api/community';

  // Posts
  static async getPosts(filters: PostFilters = {}): Promise<PostsResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.author) params.append('author', filters.author.toString());
    if (filters.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = `${this.baseUrl}/posts${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return response.data;
  }

  static async getPost(id: number): Promise<CommunityPost> {
    const response = await apiClient.get(`${this.baseUrl}/posts/${id}`);
    return response.data;
  }

  static async createPost(data: CreatePostData): Promise<CommunityPost> {
    const response = await apiClient.post(`${this.baseUrl}/posts`, data);
    return response.data;
  }

  static async updatePost(id: number, data: Partial<CreatePostData>): Promise<CommunityPost> {
    const response = await apiClient.put(`${this.baseUrl}/posts/${id}`, data);
    return response.data;
  }

  static async deletePost(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/posts/${id}`);
  }

  // Comments
  static async getComments(postId: number): Promise<CommunityComment[]> {
    const response = await apiClient.get(`${this.baseUrl}/posts/${postId}/comments`);
    return response.data;
  }

  static async createComment(postId: number, data: CreateCommentData): Promise<CommunityComment> {
    const response = await apiClient.post(`${this.baseUrl}/posts/${postId}/comments`, data);
    return response.data;
  }

  static async updateComment(id: number, content: string): Promise<CommunityComment> {
    const response = await apiClient.put(`${this.baseUrl}/comments/${id}`, { content });
    return response.data;
  }

  static async deleteComment(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/comments/${id}`);
  }

  // Voting
  static async vote(data: VoteData): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/vote`, data);
    return response.data;
  }

  static async upvote(type: 'post' | 'comment', id: number): Promise<{ message: string }> {
    return this.vote({
      voteable_type: type,
      voteable_id: id,
      vote_type: 1
    });
  }

  static async downvote(type: 'post' | 'comment', id: number): Promise<{ message: string }> {
    return this.vote({
      voteable_type: type,
      voteable_id: id,
      vote_type: -1
    });
  }

  // Admin functions
  static async togglePin(postId: number): Promise<{ message: string; is_pinned: boolean }> {
    const response = await apiClient.post(`${this.baseUrl}/posts/${postId}/pin`);
    return response.data;
  }

  static async toggleLock(postId: number): Promise<{ message: string; is_locked: boolean }> {
    const response = await apiClient.post(`${this.baseUrl}/posts/${postId}/lock`);
    return response.data;
  }

  static async toggleHide(postId: number): Promise<{ message: string; is_hidden: boolean }> {
    const response = await apiClient.post(`${this.baseUrl}/posts/${postId}/hide`);
    return response.data;
  }

  static async hideComment(commentId: number): Promise<{ message: string; is_hidden: boolean }> {
    const response = await apiClient.post(`${this.baseUrl}/comments/${commentId}/hide`);
    return response.data;
  }

  // Helper functions
  static formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  }

  static getVoteStatus(userVote?: CommunityVote): 'upvoted' | 'downvoted' | 'none' {
    if (!userVote) return 'none';
    return userVote.vote_type === 1 ? 'upvoted' : 'downvoted';
  }

  static canUserEdit(post: CommunityPost | CommunityComment, userId?: number): boolean {
    if (!userId) return false;
    return post.author_id === userId;
  }

  static canUserDelete(post: CommunityPost | CommunityComment, userId?: number, isAdmin?: boolean): boolean {
    if (!userId) return false;
    return post.author_id === userId || !!isAdmin;
  }

  static canUserModerate(isAdmin?: boolean): boolean {
    return !!isAdmin;
  }
} 