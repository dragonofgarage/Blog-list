const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', (request, response) => {
  Blog
    .findById(request.params.id).then(note => {
      response.json(note)
    })
})


blogsRouter.post('/',  async (request, response) => {
  const body = request.body

  if(body.likes === undefined)              //if the like property was not defined then
    body.likes = 0                          //set its value to 0

  if(body.url=== undefined && body.title === undefined)
    return response.status(400).json({ error : 'Content missing' })

  const blog = new Blog(body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter