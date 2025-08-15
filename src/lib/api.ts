const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  _id: string;
  id: string; // Backend provides both _id and id
  username: string;
  email: string;
  createdAt: string;
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// New interfaces for comment jobs
interface CommentJob {
  id: string;
  userId: string;
  keywords: string[];
  maxComments: number;
  options: {
    minReactions?: number;
    excludeJobPosts?: boolean;
    messageTone?: string;
    wantEmoji?: boolean;
    wantHashtags?: boolean;
  };
  status: 'waiting' | 'active' | 'completed' | 'failed';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  result?: {
    success: boolean;
    commentedCount: number;
    totalPostsScraped: number;
    sessionReport?: any;
  };
  error?: string;
}

interface CommentJobRequest {
  keywords: string[];
  maxComments: number;
  options?: {
    minReactions?: number;
    excludeJobPosts?: boolean;
    messageTone?: string;
    wantEmoji?: boolean;
    wantHashtags?: boolean;
  };
}

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

interface UserSettings {
  keywords: string[];
  postsPerDay: number;
  engagementLevel: 'low' | 'moderate' | 'high';
  startTime: string;
  isActive: boolean;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(
      response.status,
      errorData.message || 'An error occurred'
    );
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },

  // Authentication
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // User Settings
  getUserSettings: async (
    userId: string
  ): Promise<{ settings: UserSettings }> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/settings`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateUserSettings: async (
    userId: string,
    settings: Partial<UserSettings>
  ): Promise<{ message: string; settings: UserSettings }> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    return handleResponse(response);
  },

  // Comment Job Management
  startCommentJob: async (
    jobData: CommentJobRequest
  ): Promise<{ jobId: string; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/start-comment-job`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });
    const result = await handleResponse(response);
    return {
      jobId: result.data.jobId,
      message: result.message,
    };
  },

  getQueueStats: async (): Promise<{ stats: QueueStats }> => {
    const response = await fetch(`${API_BASE_URL}/comment-jobs/stats`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    return { stats: result.data };
  },

  getUserJobStatus: async (
    userId: string
  ): Promise<{
    data: {
      hasValidCookies: boolean;
      canStartJob: boolean;
      jobStatistics: any;
    };
  }> => {
    const response = await fetch(
      `${API_BASE_URL}/comment-jobs/user/${userId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    const result = await handleResponse(response);
    return { data: result.data };
  },

  // New endpoints for job history
  getJobHistory: async (
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    dateFilter?: string
  ): Promise<{ data: { jobs: CommentJob[]; pagination: any } }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status && status !== 'all') params.append('status', status);
    if (dateFilter && dateFilter !== 'all')
      params.append('dateFilter', dateFilter);

    const response = await fetch(
      `${API_BASE_URL}/comment-jobs/history/${userId}?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );
    const result = await handleResponse(response);
    return { data: result.data };
  },

  getJobDetails: async (
    jobId: string
  ): Promise<{
    data: { job: CommentJob; posts: any[]; sessionReport: any };
  }> => {
    const response = await fetch(`${API_BASE_URL}/comment-jobs/${jobId}`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    return { data: result.data };
  },

  pauseQueue: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/comment-jobs/pause`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    return { message: result.message };
  },

  resumeQueue: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/comment-jobs/resume`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    return { message: result.message };
  },

  cleanQueue: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/comment-jobs/clean`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    return { message: result.message };
  },
};

export type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiError,
  CommentJob,
  CommentJobRequest,
  QueueStats,
};
