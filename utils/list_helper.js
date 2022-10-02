const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  const reducer = (sum, item ) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let maxLike = 0
  let pos                             //to record the position of the max value in the array

  for(let i = 0; i < blogs.length; i++)
  {
    if(blogs[i].likes > maxLike)
    {
      maxLike = blogs[i].likes
      pos = i
    }
  }

  return blogs[pos]
}




module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}