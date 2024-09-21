import { React, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAll } from '../../redux/posts/postsSlice'
import Post from './Post'
import { Link } from 'react-router-dom'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  if (seconds < 60) return `Hace ${seconds} segundos`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Hace ${minutes} minutos`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} horas`
  const days = Math.floor(hours / 24)
  return `Hace ${days} días`
};

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.posts)

  useEffect(() => {
    dispatch(getAll())
  }, [dispatch])

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      {sortedPosts.map((post) => (
        <div key={post._id}>
          <Post post={post} />
          <p>Publicado: {formatDate(post.createdAt)}</p>
          <Link to={`/posts/id/${post._id}`}>Ver Detalles</Link> 
        </div>
      ))}
    </div>
  )
}

export default PostList
