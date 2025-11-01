# 🤖 AI Chat App

A modern, real-time chat application powered by Google's Gemini 2.5 Flash AI model. Built with Next.js 15, tRPC, and Supabase for a seamless conversational experience.

![AI Chat App](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.15-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🚀 **Real-time AI Conversations** - Chat with Google's Gemini 2.5 Flash model
- 🔐 **Secure Authentication** - Email/password authentication via Supabase
- 💬 **Message History** - Persistent chat history for each user
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ⚡ **Type-safe API** - End-to-end type safety with tRPC
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Supabase** - Authentication and database
- **Google Gemini API** - AI model integration

### State Management
- **TanStack Query** - Data fetching and caching
- **tRPC React Query** - Type-safe React Query integration

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A Google Gemini API key ([get one here](https://makersuite.google.com/app/apikey))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-chat-app.git
cd ai-chat-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key
```

**Where to find these:**
- **Supabase**: Dashboard → Project Settings → API
- **Gemini API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_tag TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'error')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own messages
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own messages
CREATE POLICY "Users can insert their own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 5. Configure Supabase Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. (Optional) Disable email confirmation for testing

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📱 Usage

1. **Sign Up/Login** - Create an account or log in with email and password
2. **Start Chatting** - Type your message in the input field
3. **AI Response** - Gemini 2.5 Flash will respond to your messages
4. **Toggle Dark Mode** - Click the sun/moon icon in the header
5. **View History** - All your conversations are saved automatically

## 🏗️ Project Structure

```
ai-chat-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/trpc/          # tRPC API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # React Query & tRPC providers
│   ├── components/            # React components
│   │   ├── AuthForm.tsx       # Login/signup form
│   │   └── ChatApp.tsx        # Main chat interface
│   ├── lib/                   # Utility libraries
│   │   ├── gemini.ts          # Gemini API integration
│   │   └── supabase/          # Supabase clients
│   ├── server/                # tRPC backend
│   │   ├── routers/           # API routers
│   │   │   └── chat.ts        # Chat endpoints
│   │   ├── index.ts           # Router configuration
│   │   └── trpc.ts            # tRPC setup
│   └── utils/
│       └── trpc.ts            # tRPC client
├── public/                    # Static assets
├── .env.local                 # Environment variables (create this)
├── package.json               # Dependencies
└── tsconfig.json             # TypeScript config
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production with Turbopack
npm start            # Start production server

# Type Checking
tsc --noEmit         # Check TypeScript types
```

## 🌟 Features in Detail

### Authentication
- Secure email/password authentication
- Session management with Supabase
- Automatic token refresh
- Row-level security for user data

### Chat Interface
- Real-time message updates
- Typing indicators
- Auto-scroll to latest message
- Message history persistence
- Error handling with user feedback

### AI Integration
- Google Gemini 2.5 Flash model
- Fast response times
- Context-aware conversations
- Error recovery

## 🎨 Customization

### Change AI Model

Edit `src/components/ChatApp.tsx`:

```typescript
// Change the model constant
const FIXED_MODEL = 'gemini-2.5-flash' // or another Gemini model
```

### Customize Theme

Edit `src/app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

### Add New Features

The modular architecture makes it easy to extend:

1. Add new tRPC routers in `src/server/routers/`
2. Create new components in `src/components/`
3. Add utility functions in `src/lib/`


## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Deploy! 🎉

### Other Platforms

- **Netlify**: Add environment variables and deploy
- **Railway**: Compatible with Next.js
- **Self-hosted**: Use `npm run build` and `npm start`
