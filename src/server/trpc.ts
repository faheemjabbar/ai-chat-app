import { initTRPC, TRPCError } from '@trpc/server'
import { createClient } from '@/lib/supabase/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

// ✅ Create context function
export async function createContext(opts?: FetchCreateContextFnOptions) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return {
    supabase,
    user,
  }
}

// ✅ Infer the context type properly
type Context = Awaited<ReturnType<typeof createContext>>

// ✅ Initialize tRPC with proper context typing
const t = initTRPC.context<Context>().create()

// ✅ Export router and procedures
export const router = t.router
export const publicProcedure = t.procedure

// ✅ Protected procedure with proper typing
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