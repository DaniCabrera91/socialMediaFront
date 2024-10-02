import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAll, likePost, updatePostLikes } from '../../redux/posts/postsSlice';
import { useNavigate } from 'react-router-dom';
import { Card, notification, Button, Modal, Input } from 'antd';
import { HeartOutlined, HeartFilled, CommentOutlined } from '@ant-design/icons';
import commentsService from '../../redux/comments/commentsService';
import FollowButton from '../FollowButton/FollowButton';
import './PostList.styled.scss';

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
  const [loadingLikes, setLoadingLikes] = useState({});

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
      if (loadingLikes[postId]) return;

      setLoadingLikes(prev => ({ ...prev, [postId]: true }));
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
      } finally {
        setLoadingLikes(prev => ({ ...prev, [postId]: false }));
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
    navigate(`/posts/id/${postId}`);
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {[...posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((post) => {
          const isAlreadyLiked = post.likes.includes(user?._id);
          const hasImage = post.imageUrl;

          return (
            <Card className={`card ${hasImage ? 'expanded' : ''}`} key={post._id}>
              <p>{formatDate(post.createdAt)}</p>
              {hasImage && (
                <div className='ant-card-cover'>
                  <img src={post.imageUrl} alt={post.title} />
                </div>
              )}
              <div>
                <Meta
                  title={post.title}
                  description={
                    <>
                      <p>{post.body}</p>
                      <p className="meta">
                        <strong>Publicado por:</strong> {post.userId ? post.userId.username : "Usuario desconocido"}
                        {post.userId && post.userId._id !== user?._id && (
                          <FollowButton targetUserId={post.userId._id} className='follow-button'/>
                        )}
                      </p>
                      
                    </>
                  }
                />
                <div className="like-comment">
                  <div className='like'>
                    {isAlreadyLiked ? (
                      <HeartFilled
                        onClick={() => handleLike(post._id)}
                        disabled={loadingLikes[post._id]} // Deshabilitar el botón
                      />
                    ) : (
                      <HeartOutlined
                        onClick={() => handleLike(post._id)}
                        disabled={loadingLikes[post._id]} // Deshabilitar el botón
                      />
                    )}
                    <span>{post.likes.length} </span>
                  </div>
                  <div className='comment'>
                    <CommentOutlined onClick={() => showCommentModal(post._id)}/>
                    <span>{commentsCount[post._id] || 0}</span>
                  </div>
                </div>
                <Button type="primary" onClick={() => handleViewDetails(post._id)} className='more-button'>
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
