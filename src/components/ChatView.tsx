
import React, { useState, useRef, useEffect } from 'react';
import ModelSelector from './ModelSelector';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useMessages } from '@/hooks/useMessages';
import { useChats } from '@/hooks/useChats';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ChatViewProps {
  chatId: string | null;
  onNewChat: () => void;
}

// Bot responses for different scenarios
const getBotResponse = (userMessage: string): string => {
  const responses = [
    "That's an interesting point! I'd be happy to help you explore that further.",
    "I understand what you're asking. Let me think about that for a moment.",
    "Thank you for sharing that with me. Here's what I think about your question.",
    "That's a great question! From my perspective, I would suggest considering...",
    "I appreciate you bringing this up. Based on what you've told me, I think...",
    "Interesting! Let me provide you with some thoughts on that topic.",
    "I see what you're getting at. Here's my take on the situation.",
    "That's definitely worth discussing. In my experience, this kind of thing often...",
    "Thanks for the question! I think there are a few ways to approach this.",
    "Good point! Let me share some insights that might be helpful."
  ];
  
  // Simple response selection based on message length and content
  if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
    return "Hello! I'm here to help you with any questions or topics you'd like to discuss. What can I assist you with today?";
  }
  
  if (userMessage.toLowerCase().includes('help')) {
    return "I'm here to help! Feel free to ask me about any topic, and I'll do my best to provide useful information and insights.";
  }
  
  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Main chat view component.
 * Manages chat state, renders messages, and handles sending new messages.
 */
const ChatView: React.FC<ChatViewProps> = ({ chatId, onNewChat }) => {
  const { messages, loading, addMessage } = useMessages(chatId);
  const { createChat } = useChats();
  const [isThinking, setIsThinking] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Effect to automatically scroll to the latest message.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Handles sending a new message from the user.
  const handleSendMessage = async (text: string) => {
    let currentChatId = chatId;
    
    // If no chat is selected, create a new one
    if (!currentChatId) {
      currentChatId = await createChat(text.slice(0, 50) + (text.length > 50 ? '...' : ''));
      if (!currentChatId) return;
      // The parent will handle the chat selection
    }

    // Add user message
    const success = await addMessage(text, 'user');
    if (!success) return;

    setIsThinking(true);

    // Simulate bot thinking and responding after a short delay
    setTimeout(async () => {
      const botResponse = getBotResponse(text);
      await addMessage(botResponse, 'bot');
      setIsThinking(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleNewChatClick = () => {
    onNewChat();
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold md:hidden">Chat</h2>
          <div className="flex-1 flex justify-end">
            <ModelSelector />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Start a New Conversation</h2>
            <p className="text-muted-foreground">
              Type a message below to begin chatting, or create a new chat.
            </p>
            <Button onClick={handleNewChatClick} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
        <div className="p-4 border-t border-border bg-background">
          <ChatInput onSendMessage={handleSendMessage} disabled={isThinking} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold md:hidden">Chat</h2>
        <div className="flex-1 flex justify-end">
          <ModelSelector />
        </div>
      </header>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isThinking && (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">B</div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-current rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4 border-t border-border bg-background">
        <ChatInput onSendMessage={handleSendMessage} disabled={isThinking} />
      </div>
    </div>
  );
};

export default ChatView;
