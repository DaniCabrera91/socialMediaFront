import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Post from '../Posts/Post'

const Search = () => {
  const { postName } = useParams()
  const { posts } = useSelector((state) => state.posts)

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(postName.toLowerCase()) ||
    post.body.toLowerCase().includes(postName.toLowerCase())
  )

  return (
    <div>
      <h2>Resultados de búsqueda para: {postName}</h2>
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <Post key={post._id} post={post} />
        ))
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  )
}

export default Search
