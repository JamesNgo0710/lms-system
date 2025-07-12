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
  is_bookmarked?: boolean;
  attachments?: CommunityAttachment[];
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
  attachments?: CommunityAttachment[];
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

export interface CommunityAttachment {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
  file_size_human?: string;
  is_image?: boolean;
  download_url?: string;
}

export interface CommunityBookmark {
  id: number;
  user_id: number;
  post_id: number;
  post: CommunityPost;
  created_at: string;
  updated_at: string;
}

export interface CommunityReport {
  id: number;
  reporter_id: number;
  reporter: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
  };
  reportable_type: string;
  reportable_id: number;
  reportable?: CommunityPost | CommunityComment;
  reason: 'spam' | 'harassment' | 'inappropriate_content' | 'misinformation' | 'copyright_violation' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewed_by?: number;
  reviewer?: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
  };
  admin_notes?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  attachments?: FileList;
}

export interface CreateCommentData {
  content: string;
  parent_id?: number;
  attachments?: FileList;
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
  per_page?: number;
  date_from?: string;
  date_to?: string;
  min_votes?: number;
  has_attachments?: boolean;
  pinned_only?: boolean;
  bookmarked?: boolean;
  sort_by?: 'activity' | 'created' | 'votes' | 'comments';
  sort_order?: 'asc' | 'desc';
}

export interface ReportData {
  reportable_type: 'post' | 'comment';
  reportable_id: number;
  reason: 'spam' | 'harassment' | 'inappropriate_content' | 'misinformation' | 'copyright_violation' | 'other';
  description?: string;
}

export interface BookmarksResponse {
  data: CommunityBookmark[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ReportsResponse {
  data: CommunityReport[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export class CommunityService {
  private static baseUrl = '/community';

  // Posts
  static async getPosts(filters: PostFilters = {}): Promise<PostsResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.author) params.append('author', filters.author.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.min_votes) params.append('min_votes', filters.min_votes.toString());
    if (filters.has_attachments) params.append('has_attachments', 'true');
    if (filters.pinned_only) params.append('pinned_only', 'true');
    if (filters.bookmarked) params.append('bookmarked', 'true');
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

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
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    
    if (data.attachments) {
      Array.from(data.attachments).forEach((file) => {
        formData.append('attachments[]', file);
      });
    }

    const response = await apiClient.post(`${this.baseUrl}/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.parent_id) formData.append('parent_id', data.parent_id.toString());
    
    if (data.attachments) {
      Array.from(data.attachments).forEach((file) => {
        formData.append('attachments[]', file);
      });
    }

    const response = await apiClient.post(`${this.baseUrl}/posts/${postId}/comments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

  // Bookmark functions
  static async toggleBookmark(postId: number): Promise<{ message: string; is_bookmarked: boolean }> {
    const response = await apiClient.post(`${this.baseUrl}/posts/${postId}/bookmark`);
    return response.data;
  }

  static async getUserBookmarks(page: number = 1, perPage: number = 20): Promise<BookmarksResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());
    
    const response = await apiClient.get(`${this.baseUrl}/bookmarks?${params.toString()}`);
    return response.data;
  }

  // Report functions
  static async reportContent(data: ReportData): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/report`, data);
    return response.data;
  }

  static async getReports(filters: { status?: string; reason?: string; page?: number; per_page?: number } = {}): Promise<ReportsResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.reason) params.append('reason', filters.reason);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const queryString = params.toString();
    const url = `${this.baseUrl}/reports${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return response.data;
  }

  static async updateReportStatus(reportId: number, status: string, adminNotes?: string): Promise<{ message: string; report: CommunityReport }> {
    const response = await apiClient.put(`${this.baseUrl}/reports/${reportId}/status`, {
      status,
      admin_notes: adminNotes,
    });
    return response.data;
  }

  // Attachment functions
  static async downloadAttachment(attachmentId: number): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  static async deleteAttachment(attachmentId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`${this.baseUrl}/attachments/${attachmentId}`);
    return response.data;
  }

  static getAttachmentDownloadUrl(attachmentId: number): string {
    return `/api${this.baseUrl}/attachments/${attachmentId}/download`;
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

  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size > 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  }

  static isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🔊';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
    return '📎';
  }

  static getReasonLabel(reason: string): string {
    const labels: { [key: string]: string } = {
      spam: 'Spam',
      harassment: 'Harassment',
      inappropriate_content: 'Inappropriate Content',
      misinformation: 'Misinformation',
      copyright_violation: 'Copyright Violation',
      other: 'Other',
    };
    return labels[reason] || reason;
  }

  static getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: 'Pending',
      reviewed: 'Under Review',
      resolved: 'Resolved',
      dismissed: 'Dismissed',
    };
    return labels[status] || status;
  }

  static getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'text-yellow-600',
      reviewed: 'text-blue-600',
      resolved: 'text-green-600',
      dismissed: 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  }
} 