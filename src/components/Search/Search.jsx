import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Post from '../Posts/Post';
import { Button } from 'antd';

const Search = () => {
  const { postName } = useParams();
  const { posts } = useSelector((state) => state.posts);
  const navigate = useNavigate(); // Hook para la navegación

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(postName.toLowerCase()) ||
    post.body.toLowerCase().includes(postName.toLowerCase())
  );

  const handleViewDetails = (postId) => {
    navigate(`/posts/id/${postId}`); // Navegar a los detalles del post
  };

  return (
    <div>
      <h2>Resultados de búsqueda para: {postName}</h2>
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <div key={post._id}>
            <Post post={post} />
            <Button 
              type="primary" 
              onClick={() => handleViewDetails(post._id)} 
              className='more-button'
            >
              Ver más
            </Button>
          </div>
        ))
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default Search;
