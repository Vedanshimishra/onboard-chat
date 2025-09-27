import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '@/types/chat';
import { Bot, User, FileText, Code } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} fade-in`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-[var(--gradient-primary)] text-white' 
          : 'bg-chat-header text-chat-header-foreground'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Main Message */}
        <div className={isUser ? 'message-user' : 'message-ai'}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>

        {/* File References */}
        {message.fileReferences && message.fileReferences.length > 0 && (
          <div className="w-full">
            {message.fileReferences.map((file, index) => (
              <div key={index} className="file-reference">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} className="text-primary" />
                  <span className="font-medium text-sm">{file.fileName}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {file.filePath}
                  {file.lineNumbers && ` (lines ${file.lineNumbers})`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Code Snippets */}
        {message.codeSnippets && message.codeSnippets.length > 0 && (
          <div className="w-full">
            {message.codeSnippets.map((snippet, index) => (
              <div key={index} className="code-block">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code size={14} className="text-primary" />
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {snippet.language}
                    </span>
                    {snippet.fileName && (
                      <span className="text-xs text-muted-foreground">
                        • {snippet.fileName}
                      </span>
                    )}
                  </div>
                </div>
                <SyntaxHighlighter
                  language={snippet.language.toLowerCase()}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '12px',
                    background: 'hsl(var(--code-background))',
                    fontSize: '13px',
                    lineHeight: '1.4',
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;