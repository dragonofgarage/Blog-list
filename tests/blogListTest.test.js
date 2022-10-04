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
})

describe('absence test', () => {
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

describe('single request test', () => {
  test('delete one resource', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToDelete = blogAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogAtEnd = await helper.blogsInDb()

    const contents = blogAtEnd.map(blog => blog.title)

    expect(contents).not.toContain(blogToDelete.title)
  })

  test('get one resource', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToGet = blogAtStart[0]

    await api
      .get(`/api/blogs/${blogToGet.id}`)
      .expect(200)
  })

  test('Update a resource', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]

    const UpdateBlog = {
      ...blogToUpdate, likes:9999
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}` )
      .send(UpdateBlog)

    const blogAtEnd = await helper.blogsInDb()
    const blogAfterUp = blogAtEnd[0]
    expect(blogAfterUp.likes).toBe(9999)
  })
})

afterAll(() => {
  mongoose.connection.close()
})