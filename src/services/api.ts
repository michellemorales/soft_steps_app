import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = __DEV__ 
? process.env.EXPO_PUBLIC_API_URL ||'http://127.0.0.1:8000/api'// Your FastAPI backend
  : 'https://your-production-api.com/api';

console.log('API URL:', API_URL);
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//BraveStep API
export const braveStepAPI = {
  getAISuggestions: (customStep: string) =>
   api.post('/brave-steps/ai-suggestions', {
  user_input: customStep,
}),
  
  retryAISuggestions: (customStep: string, previousSuggestions: any[]) => 
    api.post('/brave-steps/ai-suggestions/retry', {
      user_input: customStep,
      previous_suggestions: previousSuggestions,
    }),

  saveBraveStep: (step: {
    title: string;
    situation?: string;
    fear_level?: number;
  }) =>
    api.post('/brave-steps/',step),
};
export default api;