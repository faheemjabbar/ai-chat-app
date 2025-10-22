import { router, publicProcedure } from '../trpc'

export const modelsRouter = router({
  getAvailable: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  }),
})