export interface Article {
  id: number;
  avatar: string | null;
  content: string;
  image: string | null;
  title: string;
  user_id: number;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
}

export interface AuthContext {
  user: User;
}
