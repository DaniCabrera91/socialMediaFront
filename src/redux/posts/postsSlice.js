import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postsService from './postsService';

const initialState = {
  posts: [],
  isLoading: false,
  post: {},
  error: null,
};

// Obtener posts de un usuario
export const getUserPosts = createAsyncThunk('posts/getUserPosts', async (userId, thunkAPI) => {
  try {
    return await postsService.getPostsByUser(userId);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Obtener todos los posts
export const getAll = createAsyncThunk('posts/getAll', async () => {
  return await postsService.getAll();
});

// Obtener post por ID
export const getById = createAsyncThunk('posts/getById', async (id) => {
  return await postsService.getById(id);
});

// Crear un nuevo post
export const createPost = createAsyncThunk('posts/create', async (postData, thunkAPI) => {
  try {
    const response = await postsService.create(postData);
    return response;
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Actualizar un post existente
export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, data }, thunkAPI) => {
  try {
    const response = await postsService.update(id, data);
    return response;
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Eliminar un post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId, thunkAPI) => {
  try {
    await postsService.deletePost(postId); // Asegúrate de usar deletePost
    return postId;
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Dar like a un post
export const likePost = createAsyncThunk('posts/like', async (_id, thunkAPI) => {
  try {
    return await postsService.like(_id); // Asegúrate de que _id es un string válido
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    updatePostLikes: (state, action) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          likes: action.payload.likes,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getAll.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.isLoading = false;
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.post = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          state.posts.push(action.payload);
        } else {
          console.error('Post creado sin _id:', action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload; // Sobreescribe todo el objeto del post, incluyendo la imagen actualizada
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload); // Aquí el payload debe ser el postId
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = {
            ...state.posts[index],
            likes: action.payload.likes,
          };
        }
      })
  },
});

export const { reset, updatePostLikes } = postsSlice.actions;
export default postsSlice.reducer;
