const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')



beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('blog list test', () => {
  test('test store of bloglist', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })

  test('testing if the identifier named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('test post request', async () => {
    const newBlog = {
      title: 'post test',
      author: 'dragonofgrage',
      url: 'https://test.com/',
      likes: 1000,
    }

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(7)
  })

  test('test absence of like attribute', async () => {
    const newBlog = {
      title: 'like test',
      author: 'dragonofgrage',
      url: 'https://test2.com/',
    }

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')
    expect(response.body[response.body.length - 1].likes).toBe(0)
  })

  test('absence test', async () => {
    const newBlog = {
      author: 'dragonofgrage',
    }

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})