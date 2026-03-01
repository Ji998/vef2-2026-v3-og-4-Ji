import { Hono } from 'hono'
import { prisma } from '../lib/prisma.js'
import { createAuthorSchema } from '../lib/schemas/author.js'

export const authorsRouter = new Hono()

authorsRouter.get('/', async (c) => {
  try {
    const authors = await prisma.author.findMany({
      orderBy: {
        id: 'asc',
      },
    })

    return c.json(authors, 200)
  } catch (error: unknown) {
    console.error('failed to fetch authors:', error)

    return c.json(
      {
        error: 'server Error',
      },
      500,
    )
  }
})
authorsRouter.get('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))

    if (!Number.isInteger(id) || id <= 0) {
      return c.json(
        {
          error: 'invalid author id',
        },
        400,
      )
    }

    const author = await prisma.author.findUnique({
      where: { id },
    })

    if (!author) {
      return c.json(
        {
          error: 'author not found',
        },
        404,
      )
    }

    return c.json(author, 200)
  } catch (error: unknown) {
    console.error('failed to fetch author:', error)

    return c.json(
      {
        error: ' server error',
      },
      500,
    )
  }
})

authorsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()

    const parsed = createAuthorSchema.safeParse(body)

    if (!parsed.success) {
      return c.json(
        {
          error: 'invalid author data',
          issues: parsed.error.flatten(),
        },
        400,
      )
    }

    const author = await prisma.author.create({
      data: parsed.data,
    })

    return c.json(author, 201)
  } catch (error: unknown) {
    console.error('failed to create author:', error)

    return c.json(
      {
        error: 'server Error',
      },
      500,
    )
  }
})

authorsRouter.put('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))

    if (!Number.isInteger(id) || id <= 0) {
      return c.json(
        {
          error: 'invalid author id',
        },
        400,
      )
    }

    const body = await c.req.json()

    const parsed = createAuthorSchema.safeParse(body)

    if (!parsed.success) {
      return c.json(
        {
          error: 'invalid author data',
          issues: parsed.error.flatten(),
        },
        400,
      )
    }

    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    })

    if (!existingAuthor) {
      return c.json(
        {
          error: 'author not found',
        },
        404,
      )
    }

    const updatedAuthor = await prisma.author.update({
      where: { id },
      data: parsed.data,
    })

    return c.json(updatedAuthor, 200)
  } catch (error: unknown) {
    console.error('failed to update author:', error)

    return c.json(
      {
        error: 'server Error',
      },
      500,
    )
  }
})

authorsRouter.delete('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))

    if (!Number.isInteger(id) || id <= 0) {
      return c.json(
        {
          error: 'invalid author id',
        },
        400,
      )
    }

    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    })

    if (!existingAuthor) {
      return c.json(
        {
          error: 'author not found',
        },
        404,
      )
    }

    const articleCount = await prisma.article.count({
      where: { authorId: id },
    })

    if (articleCount > 0) {
      return c.json(
        {
          error: 'cannot delete author with articles',
        },
        409,
      )
    }

    await prisma.author.delete({
      where: { id },
    })

    return c.body(null, 204)
  } catch (error: unknown) {
    console.error('Failed to delete author:', error)

    return c.json(
      {
        error: 'server error',
      },
      500,
    )
  }
})