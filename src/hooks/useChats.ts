
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (title: string = 'New Chat'): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([{ user_id: user.id, title }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchChats();
      return data.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat');
      return null;
    }
  };

  const updateChatTitle = async (chatId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', chatId);

      if (error) throw error;
      
      await fetchChats();
      toast.success('Chat renamed successfully');
    } catch (error) {
      console.error('Error updating chat title:', error);
      toast.error('Failed to rename chat');
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;
      
      await fetchChats();
      toast.success('Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return {
    chats,
    loading,
    createChat,
    updateChatTitle,
    deleteChat,
    refetch: fetchChats,
  };
};
