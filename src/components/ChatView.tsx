
import React, { useState, useRef, useEffect } from 'react';
import ModelSelector from './ModelSelector';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

// Defines the structure for a chat message.
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

// Initial dummy messages to populate the chat on load.
const initialMessages: Message[] = [
  { id: '1', text: 'Hello! How can I help you today?', sender: 'bot' },
];

/**
 * Main chat view component.
 * Manages chat state, renders messages, and handles sending new messages.
 * @returns {JSX.Element} The rendered chat view.
 */
const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isThinking, setIsThinking] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Effect to automatically scroll to the latest message.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Handles sending a new message from the user.
  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: String(Date.now()), text, sender: 'user' }]);
    setIsThinking(true);

    // Simulate bot thinking and responding after a short delay.
    setTimeout(() => {
      const botResponse = "This is a simulated response. The full chatbot logic would be implemented with a backend after Supabase integration. For now, enjoy this static reply!";
      setMessages((prev) => [...prev, { id: String(Date.now() + 1), text: botResponse, sender: 'bot' }]);
      setIsThinking(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold md:hidden">Chat</h2>
        <div className="flex-1 flex justify-end">
            <ModelSelector />
        </div>
      </header>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
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
      </div>
      <div className="p-4 border-t border-border bg-background">
        <ChatInput onSendMessage={handleSendMessage} disabled={isThinking} />
      </div>
    </div>
  );
};

export default ChatView;
