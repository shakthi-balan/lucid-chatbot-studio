
import { Copy, ThumbsUp, ThumbsDown, Redo } from 'lucide-react';
import { type Message } from './ChatView';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
}

/**
 * Renders a single chat message with distinct styles for user and bot.
 * Includes action buttons (copy, like, dislike, redo) for bot messages.
 * @param {ChatMessageProps} props The props for the component.
 * @returns {JSX.Element} The rendered chat message.
 */
const ChatMessage = ({ message }: ChatMessageProps) => {
  const isBot = message.sender === 'bot';

  // Copies the bot's message text to the clipboard.
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    // In a future version, we could show a toast notification here.
  };

  return (
    <div className={`flex items-start gap-3 animate-fade-in ${isBot ? '' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
          B
        </div>
      )}
      <div className={`flex flex-col gap-2 ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`max-w-xl p-3 rounded-lg ${
            isBot ? 'bg-secondary' : 'bg-primary text-primary-foreground'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        {isBot && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Redo className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm shrink-0">
          U
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
