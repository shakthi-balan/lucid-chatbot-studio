
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}
