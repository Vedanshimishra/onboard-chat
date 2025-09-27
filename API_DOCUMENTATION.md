# AI Onboarding Buddy - Backend API Documentation

## Overview
This frontend expects a backend API endpoint at `/api/query` that processes user questions about the codebase and returns AI-generated responses.

## API Endpoint

### POST `/api/query`

**Request Format:**
```json
{
  "message": "string - The user's question about the codebase"
}
```

**Response Format:**
```json
{
  "response": "string - The AI's response to the user's question",
  "fileReferences": [
    {
      "fileName": "string - Name of the referenced file",
      "filePath": "string - Full path to the file",
      "lineNumbers": "string - Optional line numbers (e.g., '10-20')"
    }
  ],
  "codeSnippets": [
    {
      "language": "string - Programming language (e.g., 'javascript', 'python')",
      "code": "string - The actual code snippet",
      "fileName": "string - Optional file name where this code is from"
    }
  ]
}
```

## Example Request/Response

**Request:**
```json
{
  "message": "How does the authentication system work?"
}
```

**Response:**
```json
{
  "response": "The authentication system uses JWT tokens for user verification. Here's how it works:\n\n1. User submits credentials\n2. Server validates and generates JWT\n3. Client stores token for subsequent requests\n4. Token is verified on protected routes",
  "fileReferences": [
    {
      "fileName": "auth.js",
      "filePath": "/src/middleware/auth.js",
      "lineNumbers": "15-45"
    },
    {
      "fileName": "login.js", 
      "filePath": "/src/routes/login.js",
      "lineNumbers": "8-25"
    }
  ],
  "codeSnippets": [
    {
      "language": "javascript",
      "code": "const jwt = require('jsonwebtoken');\n\nfunction generateToken(user) {\n  return jwt.sign(\n    { userId: user.id, email: user.email },\n    process.env.JWT_SECRET,\n    { expiresIn: '24h' }\n  );\n}",
      "fileName": "auth.js"
    }
  ]
}
```

## Error Handling

If the backend is unavailable or returns an error, the frontend will:
1. Display an error message to the user
2. Show a toast notification about the connection issue
3. Log the error to the console
4. Suggest checking if the backend server is running

## Backend Implementation Tips

1. **Codebase Analysis**: Your backend should analyze the actual codebase and provide relevant file references
2. **Code Context**: Include relevant code snippets that help explain concepts
3. **Language Detection**: Automatically detect programming languages for proper syntax highlighting
4. **Error Handling**: Return appropriate HTTP status codes and error messages
5. **Rate Limiting**: Consider implementing rate limiting for API calls

## Sample Backend Implementation

Here's a basic Node.js/Express example:

```javascript
app.post('/api/query', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Process the message with your AI service
    const aiResponse = await processWithAI(message);
    
    // Analyze codebase for relevant files and code
    const fileReferences = await findRelevantFiles(message);
    const codeSnippets = await extractRelevantCode(message);
    
    res.json({
      response: aiResponse,
      fileReferences,
      codeSnippets
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      response: "I encountered an error processing your request. Please try again.",
      fileReferences: [],
      codeSnippets: []
    });
  }
});
```