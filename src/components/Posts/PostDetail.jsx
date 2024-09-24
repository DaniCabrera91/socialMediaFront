import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getById, likePost, updatePostLikes } from '../../redux/posts/postsSlice';
import { useParams } from 'react-router-dom';
import { Card, notification } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const { Meta } = Card;

const PostDetail = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { post, isLoading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    dispatch(getById(_id));
  }, [dispatch, _id]);

  useEffect(() => {
    if (post && user) {
      setLiked(post.likes && post.likes.includes(user._id)); // Comprobar si el usuario ya dio like
    }
  }, [post, user]);

  const handleLike = async () => {
    if (!user) {
      notification.warning({ message: 'Debes iniciar sesión para dar like' });
      return;
    }
    try {
      setLiked(!liked); // Alterna el estado de "liked"

      // Actualiza localmente el estado de likes
      const updatedLikes = liked
        ? post.likes.filter(id => id !== user._id)
        : [...post.likes, user._id];

      // Actualiza el post en el estado local
      dispatch(updatePostLikes({ ...post, likes: updatedLikes }));

      // Llama a la API para persistir el cambio
      const updatedPost = await dispatch(likePost(_id)).unwrap();
      notification.success({ message: updatedPost.message });
    } catch (err) {
      notification.error({ message: 'Error al dar like', description: err.message });
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!post) {
    return <p>No se encontró el post.</p>;
  }

  return (
    <Card
      style={{ marginBottom: '20px' }}
      cover={post.imageUrl && <img alt={post.title} src={post.imageUrl} />}
    >
      <Meta
        title={post.title}
        description={<p>{post.body}</p>}
      />
      <p><strong>Publicado por:</strong> {post.userId ? post.userId.username : 'Usuario Anónimo'}</p>
      <p>Publicado: {new Date(post.createdAt).toLocaleDateString()}</p>
      <div>
        {liked ? (
          <HeartFilled onClick={handleLike} style={{ color: 'red', cursor: 'pointer' }} />
        ) : (
          <HeartOutlined onClick={handleLike} style={{ cursor: 'pointer' }} />
        )}
        <span style={{ marginLeft: '5px' }}>{post.likes ? post.likes.length : 0}</span>
      </div>
    </Card>
  );
};

export default PostDetail;
