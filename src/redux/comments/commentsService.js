// commentsService.js
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: token } : {};
}

// Crear un nuevo comentario
const createComment = async ({ comment, postId }) => {
  try {
    const res = await axios.post(`${API_URL}/comments/post/${postId}`, { comment }, { headers: authHeader() });
    return res.data.comment; // Asegúrate de que res.data.comment incluya el username
  } catch (error) {
    console.error('Error al crear comentario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Obtener todos los comentarios de un post
const getCommentsByPost = async (postId) => {
  try {
    const res = await axios.get(`${API_URL}/comments/post/${postId}`, { headers: authHeader() });
    return res.data; // Asegúrate de que la respuesta contenga la estructura esperada
  } catch (error) {
    console.error('Error al obtener los comentarios:', error.response ? error.response.data : error.message);
    throw error;
  }
};
const getCommentsCountByPost = async (postId) => {
    try {
      const res = await axios.get(`${API_URL}/comments/count/${postId}`, { headers: authHeader() });
      return res.data.count; // Asegúrate de que la respuesta de la API tenga un campo 'count'
    } catch (error) {
      console.error('Error al obtener el recuento de comentarios:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

// Eliminar un comentario
const deleteComment = async (commentId) => {
  try {
    await axios.delete(`${API_URL}/comments/id/${commentId}`, { headers: authHeader() });
  } catch (error) {
    console.error('Error al eliminar comentario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Dar like a un comentario
const likeComment = async (commentId) => {
  try {
    const res = await axios.put(`${API_URL}/comments/like/id/${commentId}`, {}, { headers: authHeader() });
    return res.data.comment; // Asegúrate de que la respuesta contenga el comentario actualizado
  } catch (error) {
    console.error('Error al dar like al comentario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Quitar like a un comentario
const unlikeComment = async (commentId) => {
  try {
    const res = await axios.put(`${API_URL}/comments/like/id/${commentId}`, {}, { headers: authHeader() });
    return res.data.comment; // Asegúrate de que la respuesta contenga el comentario actualizado
  } catch (error) {
    console.error('Error al quitar like al comentario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const commentsService = {
  createComment,
  getCommentsByPost,
  deleteComment,
  likeComment,
  unlikeComment,
  getCommentsCountByPost
};

export default commentsService;
