
import { Button } from "@/components/ui/button";

// Dummy data for chat history to showcase the layout.
// This will be replaced with real data after backend integration.
const chatHistory = [
  { id: "1", title: "Exploring React Hooks" },
  { id: "2", title: "Building a TailwindCSS UI" },
  { id: "3", title: "Python FastAPI basics" },
  { id: "4", title: "All about LLMs" },
];

/**
 * Sidebar component containing chat history and user actions.
 * It's designed to be responsive and hides on smaller screens.
 * @returns {JSX.Element} The rendered sidebar.
 */
const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-secondary/30 p-4 flex-col border-r border-border hidden md:flex">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Chats</h1>
        <Button variant="ghost" size="sm">
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto -mr-4 pr-4">
        <nav className="flex flex-col gap-2">
          {chatHistory.map((chat) => (
            <a
              key={chat.id}
              href="#"
              className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm truncate"
            >
              {chat.title}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-auto">
        {/* Auth features will be added after Supabase integration. */}
        <Button variant="outline" className="w-full justify-center">
          Login / Sign Up
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
