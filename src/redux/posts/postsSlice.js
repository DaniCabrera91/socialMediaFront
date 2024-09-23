import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import postsService from './postsService'

const initialState = {
  posts: [],
  isLoading: false,
  post: {},
  error: null,
  likes: {},
}

export const getAll = createAsyncThunk('posts/getAll', async () => {
  return await postsService.getAll();
})

export const getById = createAsyncThunk('posts/getById', async (id) => {
  return await postsService.getById(id);
})

export const createPost = createAsyncThunk('posts/create', async (postData) => {
  const response = await postsService.create(postData)
  return response
})

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.posts = action.payload
        state.isLoading = false
      })
      .addCase(getAll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAll.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.post = action.payload
      })
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          state.posts.push(action.payload)
        } else {
          console.error('Post creado sin _id:', action.payload)
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message
      })
  },
})

export const { reset } = postsSlice.actions
export default postsSlice.reducer
