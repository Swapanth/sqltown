import apiClient from "./apiClient";

export const fetchQuestions = async () => {
  const response = await apiClient.get("/api/questions/");
  return response.data;
};

export const fetchQuestionById = async (id: number) => {
  const response = await apiClient.get(`/api/questions/${id}`);
  return response.data;
};