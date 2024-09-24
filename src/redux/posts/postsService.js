import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const authHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: token } : {}
}

// Obtener todos los posts
const getAll = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts`, { headers: authHeader() })
    return res.data
  } catch (error) {
    console.error('Error al obtener todos los posts:', error.response ? error.response.data : error.message)
    throw error
  }
}

// Obtener post por ID
const getById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/posts/id/${id}`, { headers: authHeader() })
    return res.data
  } catch (error) {
    console.error('Error al obtener el post por ID:', error.response ? error.response.data : error.message)
    throw error
  }
}

// Obtener posts de un usuario
const getPostsByUser = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/posts/user/${userId}`, { headers: authHeader() })
    return res.data
  } catch (error) {
    console.error('Error al obtener los posts del usuario:', error.response ? error.response.data : error.message)
    throw error
  }
}

// Crear un nuevo post
const create = async (postData) => {
  try {
    const headers = {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    }
    const res = await axios.post(`${API_URL}/posts`, postData, { headers })
    return res.data.post
  } catch (error) {
    console.error('Error en Solicitud:', error.response ? error.response.data : error.message)
    throw error
  }
}

// Actualizar un post existente
const update = async (_id, postData) => {
  try {
    const res = await axios.put(`${API_URL}/posts/${_id}`, postData, { headers: authHeader() })
    return res.data
  } catch (error) {
    console.error('Error al actualizar el post:', error.response ? error.response.data : error.message)
    throw error
  }
}

// Eliminar un post
const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_URL}/posts/${postId}`, { headers: authHeader() })
  } catch (error) {
    console.error('Error al eliminar el post:', error.response ? error.response.data : error.message)
    throw error
  }
}

const like = async (_id) => {
  const token = localStorage.getItem('token'); // Retrieve the token directly
  if (!token) {
    throw new Error("User not authenticated"); // Handle the case where no token is available
  }

  const res = await axios.put(
    `${API_URL}/posts/like/id/${_id}`,
    {},
    {
      headers: {
        Authorization: token, // Use the retrieved token here
      },
    }
  );
  return res.data; // Asegúrate de que esto devuelva el post con los likes actualizados y el estado de likedByUser
};


const postsService = {
  getAll,
  getById,
  getPostsByUser,
  create,
  update,
  deletePost,
  like
}

export default postsService
