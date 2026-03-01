import { z } from 'zod'

export const articleIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const articleSlugParamSchema = z.object({
  slug: z.string().trim().min(1),
})

export const createArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title needed')
    .max(300, 'max title size 300 '),
  summary: z
    .string()
    .trim()
    .min(1, 'summary required')
    .max(500, 'max summary size 500'),
  content: z
    .string()
    .trim()
    .min(1, 'Content required'),
  authorId: z.coerce.number().int().positive(),
  published: z.boolean(),
})

export const updateArticleSchema = createArticleSchema

export const articleListQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export type ArticleIdParam = z.infer<typeof articleIdParamSchema>
export type ArticleSlugParam = z.infer<typeof articleSlugParamSchema>
export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type ArticleListQuery = z.infer<typeof articleListQuerySchema>