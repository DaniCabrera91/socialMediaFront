import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../redux/posts/postsSlice';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAll } from '../../redux/posts/postsSlice'; // Asegúrate de importar getAll
import './PostCreate.styled.scss'; // Importa el archivo de estilos

const PostCreate = ({ onClose }) => {
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

        // Despacha la acción getAll para actualizar la lista de posts
        await dispatch(getAll());

        navigate('/');
        onClose(); // Cerrar el modal después de crear el post
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
    <div className="modal-content">
      <h1 className="modal-title">Crear Publicación</h1>
      <form onSubmit={onSubmit} className="modal-form">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Título"
          required
          className="modal-input"
        />
        <textarea
          name="body"
          value={formData.body}
          onChange={onChange}
          placeholder="Contenido"
          required
          className="modal-textarea"
        />
        <input
          type="file"
          name="image"
          onChange={onChange}
          className="modal-file-input"
        />
        <button type="submit" disabled={isLoading} className="modal-submit">
          {isLoading ? 'Cargando...' : 'Crear Post'}
        </button>
      </form>
      {errorMessage && <p className="modal-error">{errorMessage}</p>}
      <button onClick={onClose} className="modal-close-button">Cerrar</button> {/* Botón para cerrar el modal */}
    </div>
  );
};

export default PostCreate;
