import api from './api';

export const generateLessonPlan = async (data: any) => {
  const response = await api.post('/tools/lesson-plan', data);
  return response.data;
};

export const generateWorksheet = async (data: any) => {
  const response = await api.post('/tools/worksheet', data);
  return response.data;
};
