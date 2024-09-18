// src/components/Post.jsx
import React from 'react';

const Post = ({ post }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
    </div>
  );
};

export default Post;
