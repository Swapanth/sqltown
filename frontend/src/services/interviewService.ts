import apiClient from './apiClient';

export interface SubmissionPayload {
  question_id: number;
  status: 'Accepted' | 'Rejected';
  language: string;
  code: string;
  runtime_ms?: number;
  tests_passed: number;
  tests_total: number;
  visible_tests_passed: number;
  visible_tests_total: number;
  hidden_tests_passed: number;
  hidden_tests_total: number;
}

export interface AuthActivityResponse {
  user: {
    id: string;
    name?: string;
    email: string;
    auth_provider: string;
    last_login?: string;
  };
  metrics: {
    total_submissions: number;
    accepted_submissions: number;
    discussion_posts: number;
    discussion_replies: number;
  };
}

export const interviewService = {
  getUserSubmissions: async (questionId: number) => {
    const response = await apiClient.get('/api/interview/submissions', {
      params: { question_id: questionId },
    });
    return response.data;
  },

  createSubmission: async (payload: SubmissionPayload) => {
    const response = await apiClient.post('/api/interview/submissions', payload);
    return response.data;
  },

  getSubmissionSummary: async () => {
    const response = await apiClient.get('/api/interview/submissions/summary');
    return response.data;
  },

  getDiscussions: async (questionId: number) => {
    const response = await apiClient.get(`/api/interview/discussions/${questionId}`);
    return response.data;
  },

  createDiscussionPost: async (
    questionId: number,
    payload: { post_type: string; title?: string; content: string }
  ) => {
    const response = await apiClient.post(`/api/interview/discussions/${questionId}`, payload);
    return response.data;
  },

  createDiscussionReply: async (questionId: number, postId: number, content: string) => {
    const response = await apiClient.post(`/api/interview/discussions/${questionId}/${postId}/reply`, {
      content,
    });
    return response.data;
  },

  getAuthActivity: async (): Promise<AuthActivityResponse> => {
    const response = await apiClient.get('/api/auth/activity');
    return response.data;
  },
};
