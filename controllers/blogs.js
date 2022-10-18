const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username:1, name: 1, id: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response) => {

  const note = await Blog.findById(request.params.id)
  response.json(note)

})


blogsRouter.post('/',  async (request, response, next) => {
  const body = request.body

  const user = await request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user:user._id,
  })

  if(blog.likes === undefined)              //if the like property was not defined then
    blog.likes = 0                          //set its value to 0

  if(blog.url=== undefined || blog.title === undefined)
    return response.status(400).json({ error : 'Content missing' })

  if(blog.url=== '' || blog.title === '')
    return response.status(400).json({ error : 'Content missing' })

  try{
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try{

    const blog = await Blog.findById(request.params.id)
    const user = request.user

    //if the current user id isn't equl to bolg's owner's id
    if(blog.user.toString() !== user.id.toString())
    {
      return response.status(401).json({ error: 'blog can only be deleted by its owner' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(expection) {
    next(expection)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  try{
    const updateBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
    response.json(updateBlog)
  } catch(expection) {
    next(expection)
  }
})

module.exports = blogsRouter