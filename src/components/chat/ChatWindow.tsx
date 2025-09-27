import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message, ApiResponse } from '@/types/chat';
import ChatMessage from './ChatMessage';
import InputBox from './InputBox';
import TypingIndicator from './TypingIndicator';
import { MessageCircle, Sparkles } from 'lucide-react';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI-Generated Onboarding Buddy. I can help you understand this codebase, explain functions, find files, and answer any questions you have about the code structure. What would you like to know?",
      type: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    if (content.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the backend API
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        type: 'ai',
        timestamp: new Date(),
        fileReferences: data.fileReferences,
        codeSnippets: data.codeSnippets,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your request. This might be because the backend API is not running or there's a connection issue. Please make sure your backend server is running on the expected endpoint.",
        type: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the backend API. Please check if your server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-chat-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-chat-header text-chat-header-foreground border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <MessageCircle size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Onboarding Buddy</h1>
            <p className="text-sm opacity-90">Your codebase assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-primary">
          <Sparkles size={16} />
          <span className="text-sm font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto chat-scrollbar p-4 space-y-6"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && <TypingIndicator />}
      </div>

      {/* Input */}
      <InputBox 
        onSendMessage={sendMessage} 
        disabled={isLoading}
        placeholder="Ask about the codebase, request explanations, or get help with code..."
      />
    </div>
  );
};

export default ChatWindow;