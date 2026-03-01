import { Hono } from 'hono'
import xss from 'xss'
import { prisma } from '../lib/prisma.js'
import {
  articleListQuerySchema,
  articleSlugParamSchema,
  createArticleSchema,
  updateArticleSchema,
} from '../lib/schemas/article.js'

export const articlesRouter = new Hono()

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

articlesRouter.get('/', async (c) => {
  try {
    const query = {
      limit: c.req.query('limit'),
      offset: c.req.query('offset'),
    }

    const parsedQuery = articleListQuerySchema.safeParse(query)

    if (!parsedQuery.success) {
      return c.json(
        {
          error: 'invalid query parameters',
          issues: parsedQuery.error.flatten(),
        },
        400,
      )
    }

    const limit = parsedQuery.data.limit ?? 10
    const offset = parsedQuery.data.offset ?? 0

    const total = await prisma.article.count()

    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
      include: {
        author: true,
      },
    })

    return c.json(
      {
        data: articles,
        paging: {
          limit,
          offset,
          total,
        },
      },
      200,
    )
  } catch (error: unknown) {
    console.error('failed to fetch articles:', error)

    return c.json(
      {
        error: 'server error',
      },
      500,
    )
  }
})

articlesRouter.get('/:slug', async (c) => {
  try {
    const parsedParams = articleSlugParamSchema.safeParse({
      slug: c.req.param('slug'),
    })

    if (!parsedParams.success) {
      return c.json(
        {
          error: 'invalid article slug',
          issues: parsedParams.error.flatten(),
        },
        400,
      )
    }

    const article = await prisma.article.findUnique({
      where: {
        slug: parsedParams.data.slug,
      },
      include: {
        author: true,
      },
    })

    if (!article) {
      return c.json(
        {
          error: 'article not found',
        },
        404,
      )
    }

    return c.json(article, 200)
  } catch (error: unknown) {
    console.error('failed to fetch article:', error)

    return c.json(
      {
        error: 'server error',
      },
      500,
    )
  }
})

articlesRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()

    const parsed = createArticleSchema.safeParse(body)

    if (!parsed.success) {
      return c.json(
        {
          error: 'invalid article data',
          issues: parsed.error.flatten(),
        },
        400,
      )
    }

    const author = await prisma.author.findUnique({
      where: {
        id: parsed.data.authorId,
      },
    })

    if (!author) {
      return c.json(
        {
          error: 'author not found',
        },
        404,
      )
    }

    const cleanTitle = xss(parsed.data.title)
    const cleanSummary = xss(parsed.data.summary)
    const cleanContent = xss(parsed.data.content)
    const slug = slugify(cleanTitle)

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })

    if (existingArticle) {
      return c.json(
        {
          error: 'article slug er þegar til',
        },
        400,
      )
    }

    const article = await prisma.article.create({
      data: {
        title: cleanTitle,
        slug,
        summary: cleanSummary,
        content: cleanContent,
        published: parsed.data.published,
        authorId: parsed.data.authorId,
      },
      include: {
        author: true,
      },
    })

    return c.json(article, 201)
  } catch (error: unknown) {
    console.error('failed to create article:', error)

    return c.json(
      {
        error: 'server error',
      },
      500,
    )
  }
})

articlesRouter.put('/:slug', async (c) => {
  try {
    const parsedParams = articleSlugParamSchema.safeParse({
      slug: c.req.param('slug'),
    })

    if (!parsedParams.success) {
      return c.json(
        {
          error: 'invalid article slug',
          issues: parsedParams.error.flatten(),
        },
        400,
      )
    }

    const body = await c.req.json()

    const parsedBody = updateArticleSchema.safeParse(body)

    if (!parsedBody.success) {
      return c.json(
        {
          error: 'invalid article data',
          issues: parsedBody.error.flatten(),
        },
        400,
      )
    }

    const existingArticle = await prisma.article.findUnique({
      where: {
        slug: parsedParams.data.slug,
      },
    })

    if (!existingArticle) {
      return c.json(
        {
          error: 'article not found',
        },
        404,
      )
    }

    const author = await prisma.author.findUnique({
      where: {
        id: parsedBody.data.authorId,
      },
    })

    if (!author) {
      return c.json(
        {
          error: 'athor not found',
        },
        404,
      )
    }

    const cleanTitle = xss(parsedBody.data.title)
    const cleanSummary = xss(parsedBody.data.summary)
    const cleanContent = xss(parsedBody.data.content)
    const nextSlug = slugify(cleanTitle)

    const slugConflict = await prisma.article.findFirst({
      where: {
        slug: nextSlug,
        NOT: {
          id: existingArticle.id,
        },
      },
    })

    if (slugConflict) {
      return c.json(
        {
          error: 'article slug er þegar til',
        },
        400,
      )
    }

    const updatedArticle = await prisma.article.update({
      where: {
        slug: parsedParams.data.slug,
      },
      data: {
        title: cleanTitle,
        slug: nextSlug,
        summary: cleanSummary,
        content: cleanContent,
        published: parsedBody.data.published,
        authorId: parsedBody.data.authorId,
      },
      include: {
        author: true,
      },
    })

    return c.json(updatedArticle, 200)
  } catch (error: unknown) {
    console.error('failed to update article:', error)

    return c.json(
      {
        error: 'internal Server Error',
      },
      500,
    )
  }
})

articlesRouter.delete('/:slug', async (c) => {
  try {
    const parsedParams = articleSlugParamSchema.safeParse({
      slug: c.req.param('slug'),
    })

    if (!parsedParams.success) {
      return c.json(
        {
          error: 'invalid article slug',
          issues: parsedParams.error.flatten(),
        },
        400,
      )
    }

    const existingArticle = await prisma.article.findUnique({
      where: {
        slug: parsedParams.data.slug,
      },
    })

    if (!existingArticle) {
      return c.json(
        {
          error: 'article not found',
        },
        404,
      )
    }

    await prisma.article.delete({
      where: {
        slug: parsedParams.data.slug,
      },
    })

    return c.body(null, 204)
  } catch (error: unknown) {
    console.error('failed to delete article:', error)

    return c.json(
      {
        error: 'server error',
      },
      500,
    )
  }
})