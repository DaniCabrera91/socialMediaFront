import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

const register = async (userData) => {
  const res = await axios.post(`${API_URL}/users`, userData);
  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(`${API_URL}/users/login`, userData);

  if (res.data) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

const logout = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const res = await axios.delete(`${API_URL}/users/logout`, {
        headers: {
          Authorization: token, 
        },
      });

      if (res.data) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      return res.data;
    } catch (error) {
      console.error("Error durante el logout:", error);
      throw new Error("Error al cerrar sesión. Intenta de nuevo.");
    }
  }
};

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.clear();
      return null;
    }
  } catch (error) {
    console.error('Error al decodificar el token', error);
    localStorage.clear();
    return null;
  }

  return token;
};

const updateUser = async (userData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    },
  };

  // Assuming userData contains both ID and the FormData object
  const response = await axios.put(`${API_URL}/users/id/${userData.id}`, userData.data, config);
  return response.data.user; // Ensure this is returning the updated user
};



const authService = {
  register,
  login,
  logout,
  getToken,
  updateUser,
};

export default authService;
