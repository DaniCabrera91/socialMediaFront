import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL

const PostDetail = () => {
  const { _id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`${API_URL}/posts/id/${_id}`)
      const data = await response.json()
      setPost(data)
    };
    fetchPost()
  }, [_id])

  if (!post) {
    return <div>Cargando...</div>
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>Creado por: {post.userId?.username}</p> 
      
      {post.imageUrl ? (
        <img src={post.imageUrl} alt={post.title} />
      ) : null}

      <p>{post.body}</p>
    </div>
  )
}

export default PostDetail
