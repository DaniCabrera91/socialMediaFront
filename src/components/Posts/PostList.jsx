import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAll, likePost, updatePostLikes } from '../../redux/posts/postsSlice';
import { Link } from 'react-router-dom';
import { Card, notification, Button } from 'antd';
import { HeartOutlined, HeartFilled, CommentOutlined } from '@ant-design/icons';
import commentsService from '../../redux/comments/commentsService';

const { Meta } = Card;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `Hace ${seconds} segundos`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hace ${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} horas`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} días`;
};

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [commentsCount, setCommentsCount] = useState({});

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  // Obtener los comentarios más recientes al cargar los posts
  useEffect(() => {
    const fetchCommentsCount = async () => {
      const countData = {};
      for (const post of posts) {
        try {
          const count = await commentsService.getCommentsCountByPost(post._id);
          countData[post._id] = count; // Almacena el recuento
        } catch (error) {
          console.error(`Error fetching comments count for post ${post._id}:`, error);
          countData[post._id] = 0; // Si hay un error, establece el recuento en 0
        }
      }
      setCommentsCount(countData);
    };

    if (posts.length) fetchCommentsCount();
  }, [posts]);

  const handleLike = async (postId) => {
    if (user) {
      try {
        const post = posts.find(post => post._id === postId);
        const isAlreadyLiked = post.likes.includes(user._id);

        const updatedLikes = isAlreadyLiked
          ? post.likes.filter(id => id !== user._id)
          : [...post.likes, user._id];

        dispatch(updatePostLikes({ ...post, likes: updatedLikes }));

        const updatedPost = await dispatch(likePost(postId)).unwrap();
        notification.success({ message: updatedPost.message });
      } catch (err) {
        notification.error({ message: 'Error al dar like', description: err.message });
      }
    } else {
      notification.warning({ message: 'Debes iniciar sesión para dar like' });
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="post-list">
      {[...posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((post) => {
          const isAlreadyLiked = post.likes.includes(user?._id);

          return (
            <Card key={post._id} style={{ marginBottom: '20px' }}>
              {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: 'auto' }} />}
              <Meta
                title={post.title}
                description={
                  <>
                    <p>{post.body}</p>
                    <p><strong>Publicado por:</strong> {post.userId ? post.userId.username : 'Usuario Anónimo'}</p>
                  </>
                }
              />
              <p>Publicado: {formatDate(post.createdAt)}</p>
              <Link to={`/posts/id/${post._id}`}>Ver Detalles</Link>
              <div>
                {isAlreadyLiked ? (
                <HeartFilled onClick={() => handleLike(post._id)} style={{ color: 'red', cursor: 'pointer' }} />
                ) : (
                <HeartOutlined onClick={() => handleLike(post._id)} style={{ cursor: 'pointer' }} />
                )}
                <span style={{ marginLeft: '5px' }}>{post.likes.length}</span>
                <CommentOutlined style={{ marginLeft: '10px', cursor: 'pointer' }} />
                <span style={{ marginLeft: '5px' }}>{commentsCount[post._id] || 0}</span> {/* Muestra el recuento aquí */}
              </div>
            </Card>
          );
        })}
    </div>
  );
};

export default PostList;
