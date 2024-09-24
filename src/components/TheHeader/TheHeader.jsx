import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/auth/authSlice'
import PostCreate from '../Posts/PostCreate'

const TheHeader = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [showCreatePost, setShowCreatePost] = useState(false)

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      await dispatch(logout()).unwrap(); // Usar unwrap para manejar errores
      navigate('/login');
    } catch (error) {
      console.error("Error durante el logout:", error);
      // Aquí podrías mostrar un mensaje de error al usuario si es necesario
    }
  }

  const [text, setText] = useState('')

  const handleChange = (e) => {
    setText(e.target.value)
    if (e.key === 'Enter') {
      navigate(`/search/${encodeURIComponent(e.target.value)}`)
    }
  }
 
  return (
    <nav>
      <Link to="/">Home</Link>
      <input 
        onKeyUp={handleChange}
        placeholder="search post"
        name="text"
      />

      {user ? (
        <>
          <button onClick={() => setShowCreatePost(!showCreatePost)}>
            {showCreatePost ? 'Cancelar' : 'Crear Post'}
          </button>
          {showCreatePost && <PostCreate onClose={() => setShowCreatePost(false)} />}
          <button onClick={onLogout}>Logout</button>
          <Link to="/profile">Profile | {user.name}</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}

export default TheHeader
