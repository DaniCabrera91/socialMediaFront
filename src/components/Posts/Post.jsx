import React from 'react';

const Post = ({ post }) => {
  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p>Creado por: {post.userId?.username}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
        />
      )}
    </div>
  );
};

export default Post;
