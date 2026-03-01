import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import xss from 'xss'

const databaseUrl = process.env['DATABASE_URL']

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString: databaseUrl })

const prisma = new PrismaClient({ adapter })

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function main() {
  await prisma.article.deleteMany()
  await prisma.author.deleteMany()

  const authors = await prisma.author.createManyAndReturn({
    data: [
      {
        name: 'user',
        email: 'user@user.com',
      },
      {
        name:'user1',
        email: 'user@user1.com',
      },
      {
        name: 'user2',
        email: 'user@user2.com',
      },
    ],
  })

  const rawArticles = [
    {
      title: 'test',
      summary: 'test fyrir v3',
      content: 'test frettir v3',
      published: true,
      authorId: authors[0].id,
    },
    {
      title: 'test1',
      summary: 'test1 fyrir v3',
      content: 'test1 frettir v3',
      published: true,
      authorId: authors[1].id,
    },
    {
      title: 'test2',
      summary: 'test2 fyrir v3',
      content: 'test2 frettir v3',
      published: false,
      authorId: authors[2].id,
    },
    
    {
      title: 'test3',
      summary: 'test3 fyrir v3',
      content: 'test3 frettir v3',
      published: false,
      authorId: authors[2].id,
    },
    {
      title: 'test4',
      summary: 'test4 fyrir v3',
      content: 'test4 frettir v3',
      published: false,
      authorId: authors[1].id,
    },
    {
      title: 'test5',
      summary: 'test5 fyrir v3',
      content: 'test5 frettir v3',
      published: false,
      authorId: authors[2].id,
    },
    {
      title: 'test6',
      summary: 'test6 fyrir v3',
      content: 'test6 frettir v3',
      published: false,
      authorId: authors[2].id,
    },
    {
      title: 'tes7',
      summary: 'test7 fyrir v3',
      content: 'test7 frettir v3',
      published: false,
      authorId: authors[1].id,
    },
    {
      title: 'test7',
      summary: 'test7 fyrir v3',
      content: 'test7 frettir v3',
      published: false,
      authorId: authors[0].id,
    },
    {
      title: 'test9',
      summary: 'test9 fyrir v3',
      content: 'test9 frettir v3',
      published: false,
      authorId: authors[0].id,
    },
    {
      title: 'test10',
      summary: 'test10 fyrir v3',
      content: 'test10 frettir v3',
      published: false,
      authorId: authors[2].id
    },
   
    
  ]

  await prisma.article.createMany({
    data: rawArticles.map((article) => ({
      ...article,
      title: xss(article.title),
      summary: xss(article.summary),
      content: xss(article.content),
      slug: slugify(article.title),
    })),
  })

  console.log('Seed completed')
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })