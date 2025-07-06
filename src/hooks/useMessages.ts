
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message } from '@/types/chat';

export const useMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!chatId) return;
    
    console.log('Fetching messages for chat:', chatId);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      console.log('Fetched messages:', data);
      
      // Transform the data to match our Message interface
      const transformedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'bot',
        created_at: msg.created_at || new Date().toISOString()
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (content: string, sender: 'user' | 'bot'): Promise<boolean> => {
    if (!chatId) {
      console.error('Cannot add message: no chatId');
      return false;
    }

    console.log('Adding message:', { chatId, content, sender });
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, content, sender }]);

      if (error) throw error;
      
      console.log('Message added successfully');
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
      console.log('Chat ID changed to:', chatId);
      fetchMessages();
    } else {
      console.log('No chat ID, clearing messages');
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
