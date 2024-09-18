// src/services/postsService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// En este caso, authHeader() solo retorna la cabecera de autenticación si existe un token en localStorage.
const authHeader = () => {
  const token = JSON.parse(localStorage.getItem('token')); // Ajusta esto según cómo guardes el token
  return token ? { Authorization: token } : {};
};

// Crear un nuevo post
const create = async (postData) => {
  try {
    const headers = authHeader(); // Asegura que se incluya la cabecera con autenticación si es necesario
    const res = await axios.post(`${API_URL}/posts`, postData, { headers });
    console.log("Create Response:", res.data); // Para depuración
    return res.data;
  } catch (error) {
    console.error('Error en Solicitud:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Otros métodos (getAll, getById, update) siguen igual

const postsService = {
  getAll: async (page = 1, limit = 10) => {
    const res = await axios.get(`${API_URL}/posts?page=${page}&limit=${limit}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/posts/id/${id}`);
    return res.data;
  },
  update: async (id, postData) => {
    const res = await axios.put(`${API_URL}/posts/${id}`, postData, { headers: authHeader() });
    return res.data;
  },
  create,
};

export default postsService;
