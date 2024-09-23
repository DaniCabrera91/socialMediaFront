import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const authHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: token } : {}
}

const getAll = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts`, { headers: authHeader() })
    return res.data
  } catch (error) {
    console.error('Error al obtener todos los posts:', error.response ? error.response.data : error.message)
    throw error
  }
}

const getById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/posts/id/${id}`, { headers: authHeader() })
    return res.data
  } catch (error) {
    console.error('Error al obtener el post por ID:', error.response ? error.response.data : error.message)
    throw error
  }
}

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

const update = async (_id, postData) => {
  try {
    const res = await axios.put(`${API_URL}/posts/${_id}`, postData, { headers: authHeader() })
    return res.data
  } catch (error) {
    console.error('Error al actualizar el post:', error.response ? error.response.data : error.message)
    throw error
  }
}

const postsService = {
  getAll,
  getById,
  create,
  update
}

export default postsService
