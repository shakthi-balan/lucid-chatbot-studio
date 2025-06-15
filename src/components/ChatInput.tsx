
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

/**
 * Input component for users to type and send messages.
 * Includes a text area and a send button.
 * @param {ChatInputProps} props The props for the component.
 * @returns {JSX.Element} The rendered chat input.
 */
const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask me anything..."
        className="flex-1"
        disabled={disabled}
      />
      <Button type="submit" size="icon" disabled={disabled || !text.trim()}>
        <ArrowUp className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
