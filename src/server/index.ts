import { router } from './trpc'
import { modelsRouter } from './routers/models'
import { chatRouter } from './routers/chat'

export const appRouter = router({
  models: modelsRouter,
  chat: chatRouter,
})

export type AppRouter = typeof appRouter