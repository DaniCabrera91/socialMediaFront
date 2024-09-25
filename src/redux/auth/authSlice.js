import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';
const API_URL = import.meta.env.VITE_API_URL;

const userStorage = JSON.parse(localStorage.getItem('user'));
const tokenStorage = localStorage.getItem('token');

const initialState = {
  user: userStorage ? userStorage : null,
  token: tokenStorage ? tokenStorage : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    const message = error.response.data.errors.map(
      (error) => `${error.msg} | `
    ).join('');
    return thunkAPI.rejectWithValue(message);
  }
});

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message = error.response.data.error;
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout(); // Esta llamada eliminará el token de la base de datos
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  } catch (error) {
    console.error(error);
  }
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token; // Get the token from state
      const response = await authService.updateUser(userData); // Make sure you call updateUser with the correct arguments

      // Now we should have the updated user data
      return response; // Directly returning the updated user
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const unlikeComment = createAsyncThunk('comments/unlike', async (commentId, thunkAPI) => {
  try {
    return await commentsService.unlikeComment(commentId);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isSuccess = true;
        state.message = action.payload.message;

        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { ...state.user, ...action.payload }; // Asegúrate de que action.payload contenga la información del usuario actualizado
        localStorage.setItem('user', JSON.stringify(state.user)); // Guarda el usuario actualizado en localStorage
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Asegúrate de que el mensaje de error sea el correcto
      });
  },
});

export const { reset, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
