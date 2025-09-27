import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 fade-in">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chat-header text-chat-header-foreground flex items-center justify-center">
        <Bot size={16} />
      </div>

      {/* Typing Animation */}
      <div className="message-ai">
        <div className="typing-indicator">
          <span className="text-sm">AI is thinking</span>
          <div className="flex gap-1">
            <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
            <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
            <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;