
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * A dropdown component to allow users to select an LLM model.
 * This is a UI placeholder for now.
 * @returns {JSX.Element} The rendered model selector.
 */
const ModelSelector = () => {
  return (
    <Select defaultValue="claude-opus">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="claude-opus">Claude 3.5 Sonnet</SelectItem>
        <SelectItem value="gpt-4">GPT-4o</SelectItem>
        <SelectItem value="gemini-pro">Gemini 1.5 Pro</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;
