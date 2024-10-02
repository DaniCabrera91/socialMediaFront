import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/authSlice';
import PostCreate from '../Posts/PostCreate';
import { Modal } from 'antd';
import { SearchOutlined, PlusOutlined, LogoutOutlined, LoginOutlined, UserOutlined, UserAddOutlined, MoonFilled, SunFilled } from '@ant-design/icons';
import './TheHeader.styled.scss';

const TheHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Estado para manejar el texto de búsqueda
  const [searchText, setSearchText] = useState('');
  
  // Estado para controlar el modal de creación de post
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Estado para controlar el modal de búsqueda
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Estado para el tema oscuro/claro
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error("Error durante el logout:", error);
    }
  };

  const handleCreatePostModal = () => {
    setShowCreatePost(true);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search/${encodeURIComponent(searchText)}`);
      setShowSearchModal(false);  // Cierra el modal después de buscar
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
      <Link to="/" className="sidebar-title">PUBLICAPP</Link>
      </div>
      <div className="sidebar-menu">
        <button onClick={() => setShowSearchModal(true)} className="button secondary">
          <SearchOutlined className="icon" />
          <span className="text">Buscar</span>
        </button>

        <Modal
          title="Buscar Publicación"
          open={showSearchModal}
          onCancel={() => setShowSearchModal(false)}
          footer={null}
          className="modal"
        >
          <input
            placeholder="Escribe tu búsqueda"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </Modal>

        {user ? (
          <>
            <button onClick={handleCreatePostModal} className="button primary">
              <PlusOutlined className="icon" />
              <span className="text">Crear</span>
            </button>
            <Modal 
              open={showCreatePost}
              onCancel={() => setShowCreatePost(false)}
              footer={null}
              className="modal-create"
            >
              <PostCreate onClose={() => setShowCreatePost(false)} />
            </Modal>
            <button onClick={onLogout} className="button secondary">
              <LogoutOutlined className="icon" />
              <span className="text">Logout</span>
            </button>
            <Link to="/profile" className="button outlined">
              <UserOutlined className="icon" />
              <span className="text">Profile {user.name}</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="button outlined">
              <LoginOutlined className="icon" />
              <span className="text">Login</span>
            </Link>
            <Link to="/register" className="button outlined">
              <UserAddOutlined className="icon" />
              <span className="text">Register</span>
            </Link>
          </>
        )}
        <button onClick={toggleTheme}>
          {darkMode ? <MoonFilled className='moon' /> : <SunFilled className='sun' />}
        </button>
      </div>
    </aside>
  );
};

export default TheHeader;
