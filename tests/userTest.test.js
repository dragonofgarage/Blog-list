const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const { post } = require('../app.js')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'dragonofgarage',
      name: 'sumai',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const  usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

})

describe('post,get and validation', () => {
  test('get the content from server', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('validation of username', async () => {
    //lack of username
    const newUser = {
      name:'test',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')

    //unfit username
    const newUser2 = {
      username : 'te',
      name:'test',
      password: 'password'
    }

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
    expect(result2.body.error).toContain('User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3).')
  })

  test('validation of password', async () => {
    const newUser = {
      username: 'testtest',
      name:'test'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('password must be needed and length at least 3 charaters')
  })
})