import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';

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
    );
    return thunkAPI.rejectWithValue(message);
  }
});

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const updateUser = createAsyncThunk('auth/updateUser', async (userData, thunkAPI) => {
  try {
    return await authService.updateUser(userData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});


export const followUser = createAsyncThunk('auth/followUser', async (userId, thunkAPI) => {
  try {
    return await authService.followUser(userId);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const unfollowUser = createAsyncThunk('auth/unfollowUser', async (userId, thunkAPI) => {
  try {
    return await authService.unfollowUser(userId);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
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
    updateUserFollowStatus: (state, action) => {
      state.user.follows = action.payload.follows; // Actualizar la lista de "follows" del usuario
    }
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
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.isSuccess = true;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.user.follows = action.payload.follows; 
        state.isSuccess = true;
        state.message = "Has seguido al usuario con éxito.";
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.user.follows = action.payload.follows; 
        state.isSuccess = true;
        state.message = "Has dejado de seguir al usuario con éxito.";
      });     
  },
});

export const { reset, clearAuthState, updateUserFollowStatus } = authSlice.actions;
export default authSlice.reducer;
