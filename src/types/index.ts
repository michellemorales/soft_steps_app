export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface ReflectionChatResponse {
  reply: string;
  received_message: string;
  created_at: string;
}