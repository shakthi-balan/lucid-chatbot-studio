
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useChats } from "@/hooks/useChats";
import { Chat } from "@/types/chat";
import ChatSearch from "./ChatSearch";
import ChatItem from "./ChatItem";
import { LogOut, Plus } from "lucide-react";

interface SidebarProps {
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

/**
 * Sidebar component containing chat history and user actions.
 * It's designed to be responsive and hides on smaller screens.
 */
const Sidebar: React.FC<SidebarProps> = ({ activeChatId, onChatSelect }) => {
  const { user, signOut } = useAuth();
  const { chats, loading, createChat, updateChatTitle, deleteChat, refetch } = useChats();
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  // Refresh chats when a new chat might have been created
  useEffect(() => {
    if (activeChatId && !chats.find(chat => chat.id === activeChatId)) {
      refetch();
    }
  }, [activeChatId, chats, refetch]);

  const handleNewChat = async () => {
    const chatId = await createChat();
    if (chatId) {
      onChatSelect(chatId);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
    if (activeChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      onChatSelect(remainingChats.length > 0 ? remainingChats[0].id : '');
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-secondary/30 p-4 flex-col border-r border-border hidden md:flex">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Chats</h1>
        <Button variant="ghost" size="sm" onClick={handleNewChat}>
          <Plus className="h-4 w-4 mr-1" />
          New Chat
        </Button>
      </div>
      
      <ChatSearch chats={chats} onFilteredChats={setFilteredChats} />
      
      <div className="flex-1 overflow-y-auto -mr-4 pr-4">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <nav className="flex flex-col gap-1">
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={activeChatId === chat.id}
                onClick={() => onChatSelect(chat.id)}
                onRename={updateChatTitle}
                onDelete={handleDeleteChat}
              />
            ))}
            {filteredChats.length === 0 && !loading && (
              <div className="text-center text-muted-foreground text-sm mt-4">
                No chats found
              </div>
            )}
          </nav>
        )}
      </div>
      
      <div className="mt-auto space-y-2">
        <div className="text-sm text-muted-foreground truncate">
          {user?.email}
        </div>
        <Button variant="outline" className="w-full justify-center" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
