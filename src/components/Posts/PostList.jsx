import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAll, likePost, updatePostLikes } from '../../redux/posts/postsSlice';
import { useNavigate } from 'react-router-dom';
import { Card, notification, Button, Modal, Input } from 'antd';
import { HeartOutlined, HeartFilled, CommentOutlined } from '@ant-design/icons';
import commentsService from '../../redux/comments/commentsService';
import FollowButton from '../FollowButton/FollowButton';

const { Meta } = Card;
const { TextArea } = Input;

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
  const navigate = useNavigate();
  const { posts, isLoading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [commentsCount, setCommentsCount] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      const countData = {};
      for (const post of posts) {
        try {
          const count = await commentsService.getCommentsCountByPost(post._id);
          countData[post._id] = count;
        } catch (error) {
          console.error(`Error fetching comments count for post ${post._id}:`, error);
          countData[post._id] = 0;
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

  const showCommentModal = (postId) => {
    setSelectedPostId(postId);
    setIsModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      notification.warning({ message: 'El comentario no puede estar vacío' });
      return;
    }

    try {
      await commentsService.createComment({ comment: commentText, postId: selectedPostId });
      setCommentText('');
      setIsModalVisible(false);
      notification.success({ message: 'Comentario agregado con éxito' });

      setCommentsCount(prevCount => ({
        ...prevCount,
        [selectedPostId]: (prevCount[selectedPostId] || 0) + 1
      }));

    } catch (error) {
      notification.error({ message: 'Error al agregar comentario', description: error.message });
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCommentText('');
  };

  const handleViewDetails = (postId) => {
    navigate(`/posts/id/${postId}`); // Navegar a la página de detalles del post
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
            <Card
              key={post._id}
              style={{ marginBottom: '20px' }}
              cover={post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%' }} />}
            >
              <div style={{ padding: '10px' }}>
                <Meta
                  title={post.title}
                  description={
                    <>
                      <p>{post.body}</p>
                      <p>
                        <strong>Publicado por:</strong> {post.userId ? post.userId.username : 'Usuario Anónimo'}
                        {post.userId && (
                          <span> {/* Eliminar el stopPropagation */}
                            <FollowButton postUserId={post.userId._id} />
                          </span>
                        )}
                      </p>
                    </>
                  }
                />
                <p>Publicado: {formatDate(post.createdAt)}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    {isAlreadyLiked ? (
                      <HeartFilled onClick={() => handleLike(post._id)} style={{ color: 'red', cursor: 'pointer' }} />
                    ) : (
                      <HeartOutlined onClick={() => handleLike(post._id)} style={{ cursor: 'pointer' }} />
                    )}
                    <span style={{ marginLeft: '5px' }}>{post.likes.length}</span>
                  </div>
                  <div>
                    <CommentOutlined onClick={() => showCommentModal(post._id)} style={{ cursor: 'pointer' }} />
                    <span style={{ marginLeft: '5px' }}>{commentsCount[post._id] || 0}</span>
                  </div>
                </div>
                <Button type="primary" onClick={() => handleViewDetails(post._id)} style={{ marginTop: '10px' }}>
                  Ver más
                </Button>
              </div>
            </Card>
          );
        })}

      <Modal
        title="Agregar comentario"
        open={isModalVisible}
        onOk={handleCommentSubmit}
        onCancel={closeModal}
        okText="Enviar"
        cancelText="Cancelar"
      >
        <TextArea
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Escribe un comentario..."
        />
      </Modal>
    </div>
  );
};

export default PostList;
