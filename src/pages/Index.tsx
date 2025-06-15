
import Sidebar from "@/components/Sidebar";
import ChatView from "@/components/ChatView";

/**
 * The main page of the application, which lays out the chat interface.
 * It combines the Sidebar and the main ChatView.
 */
const Index = () => {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <ChatView />
      </main>
    </div>
  );
};

export default Index;
