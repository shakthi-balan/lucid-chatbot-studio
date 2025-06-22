
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Chat } from '@/types/chat';

interface ChatSearchProps {
  chats: Chat[];
  onFilteredChats: (filtered: Chat[]) => void;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ chats, onFilteredChats }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      onFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.title.toLowerCase().includes(term.toLowerCase())
      );
      onFilteredChats(filtered);
    }
  };

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default ChatSearch;
