import { router } from './trpc'
import { chatRouter } from './routers/chat'

// ✅ Removed models router - not needed anymore
export const appRouter = router({
  chat: chatRouter,
})

export type AppRouter = typeof appRouter