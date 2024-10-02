import React from 'react'
import PostList from '../Posts/PostList'
import './Home.styled.scss'

const Home = () => {
  return (
    <div className='homeBody'>
      <h1>Posts</h1>
      <PostList/>
    </div>
  )
}

export default Home