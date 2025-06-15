
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  created_at: string;
}

export const useMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!chatId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (content: string, sender: 'user' | 'bot'): Promise<boolean> => {
    if (!chatId) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, content, sender }]);

      if (error) throw error;
      
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [chatId]);

  return {
    messages,
    loading,
    addMessage,
    refetch: fetchMessages,
  };
};
