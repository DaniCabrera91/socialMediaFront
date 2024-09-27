import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentsService from './commentsService';

export const getCommentsByPost = createAsyncThunk('comments/getByPost', async (postId, thunkAPI) => {
  try {
    return await commentsService.getCommentsByPost(postId);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createComment = createAsyncThunk('comments/create', async (commentData, thunkAPI) => {
  try {
    return await commentsService.createComment(commentData);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Action para likeComment
export const likeComment = createAsyncThunk('comments/like', async (commentId, thunkAPI) => {
  try {
    return await commentsService.likeComment(commentId);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Action para unlikeComment
export const unlikeComment = createAsyncThunk('comments/unlike', async (commentId, thunkAPI) => {
  try {
    return await commentsService.unlikeComment(commentId);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommentsByPost.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.comments.findIndex(comment => comment._id === updatedComment._id);
        if (index !== -1) {
          state.comments[index] = updatedComment; // Actualiza el comentario en el estado
        }
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.comments.findIndex(comment => comment._id === updatedComment._id);
        if (index !== -1) {
          state.comments[index] = updatedComment; // Actualiza el comentario en el estado
        }
      });
  },
});

export const {} = commentsSlice.actions;
export default commentsSlice.reducer;
