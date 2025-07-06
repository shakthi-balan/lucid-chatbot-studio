
-- Create chats table
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chats
CREATE POLICY "Users can view their own chats" 
  ON public.chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chats" 
  ON public.chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats" 
  ON public.chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats" 
  ON public.chats 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for messages
CREATE POLICY "Users can view messages from their chats" 
  ON public.messages 
  FOR SELECT 
  USING (
    chat_id IN (
      SELECT id FROM public.chats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their chats" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (
    chat_id IN (
      SELECT id FROM public.chats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in their chats" 
  ON public.messages 
  FOR UPDATE 
  USING (
    chat_id IN (
      SELECT id FROM public.chats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their chats" 
  ON public.messages 
  FOR DELETE 
  USING (
    chat_id IN (
      SELECT id FROM public.chats WHERE user_id = auth.uid()
    )
  );
