import { initTRPC, TRPCError } from '@trpc/server'
import { createClient } from '@/lib/supabase/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return {
    supabase,
    user,
  }
}

const t = initTRPC.context<typeof createContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})