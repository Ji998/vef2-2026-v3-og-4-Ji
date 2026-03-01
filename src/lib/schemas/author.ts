import { z } from 'zod'

export const authorIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const createAuthorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'can not be empty')
    .max(60, 'max is 60'),
  email: z
    .string()
    .trim()
    .email('invalid email ')
    .max(300, 'max is 300 '),
})

export const updateAuthorSchema = createAuthorSchema

export type AuthorIdParam = z.infer<typeof authorIdParamSchema>
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>