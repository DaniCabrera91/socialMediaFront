// src/redux/posts/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "./postsService";

const initialState = {
  posts: [],
  isLoading: false,
  post: {},
  error: null,
};

export const getAll = createAsyncThunk("posts/getAll", async () => {
  try {
    return await postsService.getAll();
  } catch (error) {
    console.error(error);
  }
});

export const getById = createAsyncThunk("posts/getById", async (id) => {
  try {
    return await postsService.getById(id);
  } catch (error) {
    console.error(error);
  }
});

export const createPost = createAsyncThunk("posts/create", async (postData) => {
  try {
    return await postsService.create(postData);
  } catch (error) {
    console.error('Error al crear post:', error.response ? error.response.data : error.message);
    throw error; // Para manejar el error en el componente
  }
});

export const updatePost = createAsyncThunk("posts/update", async ({ id, postData }) => {
  try {
    return await postsService.update(id, postData);
  } catch (error) {
    console.error(error);
  }
});

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(getAll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.post = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        console.log('Post created:', action.payload); // Verifica el payload aquí
        if (action.payload._id) {
          state.posts.push(action.payload);
        } else {
          console.error('Post created without _id:', action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.posts = state.posts.map(post => post._id === action.payload._id ? action.payload : post);
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { reset } = postsSlice.actions;
export default postsSlice.reducer;
