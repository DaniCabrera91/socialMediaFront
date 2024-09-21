import axios from 'axios';
import { getToken, setToken, removeToken } from './tokenService';
import { useNavigate } from 'react-router-dom'; // Importar el hook

const API_URL = import.meta.env.VITE_API_URL;

const register = async (userData) => {
  const res = await axios.post(`${API_URL}/users`, userData);
  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(`${API_URL}/users/login`, userData);

  if (res.data) {
    const token = res.data.token;
    setToken(token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

const logout = async () => {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/users/logout`, {
    headers: {
      Authorization: token,
    },
  });

  if (res.data) {
    localStorage.removeItem('user');
    removeToken();
  }
  return res.data;
};

const authService = {
  register,
  login,
  logout,
};

export const setupAxiosInterceptors = (navigate) => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        removeToken();
        localStorage.removeItem('user');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );
};

export default authService;
