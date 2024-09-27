import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: token } : {};
};

// Función para manejar las solicitudes y los errores
const fetchData = async (method, url, data = null) => {
  try {
    const options = {
      method,
      url,
      headers: authHeader(),
      ...(data && { data }), // Solo añade data si no es null
    };
    const res = await axios(options);
    return res.data;
  } catch (error) {
    console.error(`Error en ${method} ${url}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Obtener todos los posts
const getAll = () => fetchData('get', `${API_URL}/posts`);

// Obtener post por ID
const getById = (id) => fetchData('get', `${API_URL}/posts/id/${id}`);

// Obtener posts de un usuario
const getPostsByUser = (userId) => fetchData('get', `${API_URL}/posts/user/${userId}`);

// Crear un nuevo post
const create = (postData) => fetchData('post', `${API_URL}/posts`, postData);

// Actualizar un post existente
const update = (_id, postData) => fetchData('put', `${API_URL}/posts/${_id}`, postData);

// Eliminar un post
const deletePost = (postId) => fetchData('delete', `${API_URL}/posts/${postId}`);

// Dar like a un post
const like = async (_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("User not authenticated");
  }
  return fetchData('put', `${API_URL}/posts/like/id/${_id}`);
};

const postsService = {
  getAll,
  getById,
  getPostsByUser,
  create,
  update,
  deletePost,
  like,
};

export default postsService;
