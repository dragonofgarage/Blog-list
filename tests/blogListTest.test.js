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

})

afterAll(() => {
  mongoose.connection.close()
})