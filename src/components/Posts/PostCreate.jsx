import React, { useState } from 'react';
import axios from 'axios';
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // Para mostrar errores

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
    
    let imageUrl = '';
  
    // Solo sube la imagen si el usuario ha seleccionado una
    if (formData.image) {
      const uploadData = new FormData(); // Crea una nueva instancia de FormData
      uploadData.append('file', formData.image);
      uploadData.append('upload_preset', 'Social_Media_Project'); // Asegúrate de que esto es correcto
      uploadData.append('cloud_name', 'dyt3uvyo7'); // Puedes eliminar esto si no es necesario para Cloudinary

      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dyt3uvyo7/image/upload', uploadData);
        imageUrl = response.data.secure_url;
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to upload image',
        });
        return;
      }
    }
  
    try {
      const postData = imageUrl ? { title: formData.title, body: formData.body, imageUrl } : { title: formData.title, body: formData.body };
      const result = await dispatch(createPost(postData));
      
      if (createPost.fulfilled.match(result)) {
        notification.success({
          message: 'Success',
          description: 'Post created successfully',
        });
        navigate('/');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Debes estar autenticado para crear un post.");
      } else {
        notification.error({
          message: 'Error',
          description: error.message || 'Failed to create post',
        });
      }
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
        <button type="submit">Crear Post</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PostCreate;
