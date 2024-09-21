const TOKEN_KEY = 'token';

export const getToken = () => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
