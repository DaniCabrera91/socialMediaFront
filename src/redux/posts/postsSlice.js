import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "./postsService";

const initialState = {
  posts: [],
  isLoading: false,
  post: {},
  error: null,
};

export const getAll = createAsyncThunk("posts/getAll", async () => {
  return await postsService.getAll();
});

export const getById = createAsyncThunk("posts/getById", async (id) => {
  return await postsService.getById(id);
});

export const createPost = createAsyncThunk("posts/create", async (postData) => {
  const response = await postsService.create(postData);
  return response; // Aquí ahora será el post creado directamente
});

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null; // Resetear el error también
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.isLoading = false; // Finalizar carga
      })
      .addCase(getAll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAll.rejected, (state, action) => {
        state.isLoading = false; // Finalizar carga
        state.error = action.error.message; // Capturar error
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
        state.error = action.error.message; // Capturar error
      })
  },
});

export const { reset } = postsSlice.actions;
export default postsSlice.reducer;
