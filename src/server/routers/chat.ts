import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { generateResponse } from '@/lib/gemini'
import { TRPCError } from '@trpc/server'

export const chatRouter = router({
  send: protectedProcedure
    .input(
      z.object({
        modelTag: z.string(),
        prompt: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { modelTag, prompt } = input

      // ✅ Validate model
      if (modelTag !== 'gemini-2.5-flash') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only Gemini 2.5 Flash is supported',
        })
      }

      // ✅ Save user message
      const { error: userMsgError } = await ctx.supabase
        .from('messages')
        .insert({
          user_id: ctx.user.id,
          model_tag: modelTag,
          role: 'user',
          content: prompt,
        })

      if (userMsgError) {
        console.error('Failed to save user message:', userMsgError)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save your message',
        })
      }

      try {
        // ✅ Generate AI response
        const aiResponse = await generateResponse(modelTag, prompt)

        // ✅ Save AI message
        const { error: aiMsgError } = await ctx.supabase
          .from('messages')
          .insert({
            user_id: ctx.user.id,
            model_tag: modelTag,
            role: 'assistant',
            content: aiResponse,
          })

        if (aiMsgError) {
          console.error('Failed to save AI message:', aiMsgError)
          throw aiMsgError
        }

        return {
          role: 'assistant' as const,
          content: aiResponse,
        }
      } catch (error: any) {
        console.error('AI generation error:', error)

        // ✅ Save error message
        await ctx.supabase.from('messages').insert({
          user_id: ctx.user.id,
          model_tag: modelTag,
          role: 'error',
          content: 'Failed to generate response. Please try again.',
        })

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to generate AI response',
        })
      }
    }),

  history: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('messages')
      .select('*')
      .eq('user_id', ctx.user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to fetch message history:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to load message history',
      })
    }

    return data || []
  }),
})