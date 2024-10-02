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

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, updatedData }) => {
    return await commentsService.updateComment(commentId, updatedData);
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId) => {
    return await commentsService.deleteComment(commentId);
  }
);

export const likeComment = createAsyncThunk('comments/like', async (commentId, thunkAPI) => {
  try {
    return await commentsService.likeComment(commentId);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

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
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment._id !== action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.comments.findIndex(comment => comment._id === updatedComment._id);
        if (index !== -1) {
          state.comments[index] = updatedComment;
        }
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.comments.findIndex(comment => comment._id === updatedComment._id);
        if (index !== -1) {
          state.comments[index] = updatedComment;
        }
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.comments.findIndex(comment => comment._id === updatedComment._id);
        if (index !== -1) {
          state.comments[index] = updatedComment;
        }
      });
  },
});

export const {} = commentsSlice.actions;
export default commentsSlice.reducer;
