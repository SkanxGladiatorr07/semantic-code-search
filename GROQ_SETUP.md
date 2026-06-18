# Groq API Setup Instructions

The system has been migrated from OpenAI to **Groq** - a free AI service with generous rate limits.

## Why Groq?
- **100% Free** - No credit card required
- **Fast responses** - Powered by LPU architecture
- **Generous limits** - Much higher than OpenAI free tier
- **Easy setup** - Simple API key, no payment needed

## Setup Steps

### 1. Get Groq API Key (Free)
1. Go to: https://console.groq.com
2. Sign up with your email (no payment needed)
3. Go to API Keys section
4. Click "Create API Key"
5. Copy your API key (starts with `gsk_...`)

### 2. Update Environment File
1. Open `backend/.env`
2. Replace `YOUR_GROQ_API_KEY_HERE` with your actual Groq API key:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
3. Save the file

### 3. Restart Backend Server
```bash
cd backend
npm start
```

## What Changed?
- ✅ Migrated from `openai` package to `groq-sdk`
- ✅ Updated all controllers to use `groqService` instead of `aiService`
- ✅ Using model: `llama-3.3-70b-versatile` (powerful and fast)
- ✅ Increased max tokens from 2000 to 8000 (more detailed responses)
- ✅ Same functionality - chat, code analysis, all features work

## Files Modified
- `backend/src/services/groqService.js` - New service created
- `backend/src/controllers/analysisController.js` - Updated imports
- `backend/src/controllers/aiController.js` - Updated imports
- `backend/src/middleware/aiMiddleware.js` - Updated imports
- `backend/.env` - Changed from OPENAI_API_KEY to GROQ_API_KEY
- `backend/package.json` - Added groq-sdk dependency

## Test AI Chat
Once you add your Groq API key:
1. Restart backend server
2. Open frontend
3. Navigate to repository
4. Click "AI Chat"
5. Ask questions about your code - should work instantly!

## Troubleshooting
- **Error: GROQ_API_KEY is not configured**
  → Make sure you added your API key to backend/.env
  
- **Error: Failed to initialize Groq service**
  → Check that your API key is correct and starts with `gsk_`
  
- **Still getting rate limit errors**
  → This shouldn't happen with Groq's generous limits, but if it does, wait a minute and try again

## API Key Security
⚠️ Never commit your actual API key to git. The .env file should be in .gitignore.
