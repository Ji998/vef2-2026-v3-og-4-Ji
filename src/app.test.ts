import test from 'node:test'
import assert from 'node:assert/strict'
import { app } from './app.js'

test('GET /authors returns 200', async () => {
  const res = await app.request('/authors')
  assert.equal(res.status, 200)
})

test('GET /authors/999999 returns 404', async () => {
  const res = await app.request('/authors/999999')
  assert.equal(res.status, 404)
})

test('GET /articles returns paging structure', async () => {
  const res = await app.request('/articles')
  assert.equal(res.status, 200)

  const body = await res.json()

  assert.ok(body.data)
  assert.ok(body.paging)
  assert.equal(typeof body.paging.limit, 'number')
  assert.equal(typeof body.paging.offset, 'number')
  assert.equal(typeof body.paging.total, 'number')
})

test('GET /articles/this-slug-should-not-exist returns 404', async () => {
  const res = await app.request('/articles/this-slug-should-not-exist')
  assert.equal(res.status, 404)
})