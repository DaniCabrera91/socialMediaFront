import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../redux/posts/postsSlice';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const PostCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prevState) => ({ ...prevState, image: files[0] }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('body', formData.body);

    if (formData.image) postData.append('image', formData.image);
    try {
      const result = await dispatch(createPost(postData));
      if (createPost.fulfilled.match(result)) {
        notification.success({
          message: 'Éxito',
          description: 'Post creado exitosamente',
        });
        navigate('/');
      } else {
        throw new Error('Error al crear el post');
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Error al crear el post',
      });
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Crear Publicación</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Título"
          required
        />
        <textarea
          name="body"
          value={formData.body}
          onChange={onChange}
          placeholder="Contenido"
          required
        />
        <input
          type="file"
          name="image"
          onChange={onChange}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Crear Post'}
        </button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PostCreate;
