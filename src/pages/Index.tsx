
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import ChatView from "@/components/ChatView";
import AuthPage from "@/components/AuthPage";
import { useState } from "react";

/**
 * The main page of the application, which lays out the chat interface.
 * It combines the Sidebar and the main ChatView.
 */
const Index = () => {
  const { user, loading } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-background text-foreground items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleChatCreated = (chatId: string) => {
    setActiveChatId(chatId);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar 
        activeChatId={activeChatId} 
        onChatSelect={setActiveChatId} 
      />
      <main className="flex-1 flex flex-col">
        <ChatView 
          chatId={activeChatId} 
          onNewChat={() => setActiveChatId(null)}
          onChatCreated={handleChatCreated}
        />
      </main>
    </div>
  );
};

export default Index;
