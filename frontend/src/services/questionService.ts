import apiClient from "./apiClient";

export const fetchQuestions = async () => {
  const res = await apiClient.get("/api/questions/");
  return res.data;
};

export const fetchQuestionById = async (id: number) => {
  const res = await apiClient.get(`/api/questions/${id}`);
  return res.data;
};