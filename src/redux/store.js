import { configureStore } from '@reduxjs/toolkit'
import auth from '../redux/auth/authSlice'
import posts from '../redux/posts/postsSlice'
import comments from '../redux/comments/commentsSlice'


export const store = configureStore({
  reducer: {
    auth,
    posts, 
    comments
  },
})
