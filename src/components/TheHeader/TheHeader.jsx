// src/components/TheHeader.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/authSlice';
import PostCreate from '../Posts/PostCreate';

const TheHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const onLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
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
  );
};

export default TheHeader;
