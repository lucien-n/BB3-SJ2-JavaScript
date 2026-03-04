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

export interface Comment {
  id: number;
  content: string;
  article_id: number;
  user_id: number;
  created_at: string;
}

export interface AuthContext {
  user: User;
}
