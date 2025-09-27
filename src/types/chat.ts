export interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  fileReferences?: FileReference[];
  codeSnippets?: CodeSnippet[];
}

export interface FileReference {
  fileName: string;
  filePath: string;
  lineNumbers?: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
  fileName?: string;
}

export interface ApiResponse {
  response: string;
  fileReferences?: FileReference[];
  codeSnippets?: CodeSnippet[];
}