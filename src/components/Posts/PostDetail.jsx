import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getById, likePost, updatePostLikes } from '../../redux/posts/postsSlice';
import { useParams } from 'react-router-dom';
import { Card, notification, Input, Button } from 'antd';
import { HeartOutlined, HeartFilled, LikeOutlined, LikeFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import commentsService from '../../redux/comments/commentsService';
import { likeComment, unlikeComment } from '../../redux/comments/commentsSlice';
import FollowButton from '../FollowButton/FollowButton';
import './PostDetail.styled.scss';

const { Meta } = Card;
const { TextArea } = Input;

const PostDetail = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { post, isLoading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [likedPost, setLikedPost] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null); // Estado para el comentario en edición

  useEffect(() => {
    const loadPostAndComments = async () => {
      try {
        await dispatch(getById(_id));
        await fetchComments();
      } catch (error) {
        console.error('Error al cargar el post o comentarios:', error);
        notification.error({ message: 'Error al cargar datos', description: error.message });
      }
    };
    loadPostAndComments();
  }, [dispatch, _id]);

  useEffect(() => {
    if (post && post.likes) {
      const userHasLiked = post.likes.includes(user?._id);
      setLikedPost(userHasLiked);
      setLikesCount(post.likes.length);
    }
  }, [post, user]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await commentsService.getCommentsByPost(_id);
      setComments(fetchedComments || []);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      notification.error({ message: 'Error al cargar comentarios', description: error.message });
    }
  };

  const handlePostLike = async () => {
    if (!user) {
      notification.warning({ message: 'Debes iniciar sesión para dar like' });
      return;
    }

    try {
      const isAlreadyLiked = post.likes?.includes(user._id);
      const updatedLikes = isAlreadyLiked
        ? post.likes.filter(id => id !== user._id)
        : [...(post.likes || []), user._id];

      dispatch(updatePostLikes({ ...post, likes: updatedLikes }));
      setLikesCount(updatedLikes.length);
      setLikedPost(!isAlreadyLiked);

      await dispatch(likePost(post._id)).unwrap();

      notification.success({
        message: `Has ${isAlreadyLiked ? 'quitado' : 'dado'} like al post`,
      });

      dispatch(getById(post._id));
    } catch (error) {
      console.error('Error al dar/quitar like al post:', error);
      notification.error({ message: 'Error al dar/quitar like al post', description: error.message });
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText) {
      notification.warning({ message: 'El comentario no puede estar vacío' });
      return;
    }

    try {
      if (editingCommentId) {
        // Si estamos editando un comentario
        await commentsService.updateComment(editingCommentId, { comment: commentText });
        notification.success({ message: 'Comentario editado con éxito' });
        setEditingCommentId(null); // Resetear el estado de edición
      } else {
        // Si estamos creando un nuevo comentario
        await commentsService.createComment({ comment: commentText, postId: _id });
        notification.success({ message: 'Comentario agregado con éxito' });
      }

      setCommentText(''); // Limpiar el campo de texto
      await fetchComments();
    } catch (error) {
      console.error('Error al agregar/editar comentario:', error);
      notification.error({ message: 'Error al agregar/editar comentario', description: error.message });
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!user) {
      notification.warning({ message: 'Debes iniciar sesión para dar like al comentario' });
      return;
    }

    try {
      const updatedComments = comments.map((comment) => {
        if (comment._id === commentId) {
          const hasLiked = comment.likes && comment.likes.includes(user._id);
          const updatedLikes = hasLiked
            ? comment.likes.filter((userId) => userId !== user._id)
            : [...(comment.likes || []), user._id];

          return { ...comment, likes: updatedLikes };
        }
        return comment;
      });

      setComments(updatedComments);

      const action = updatedComments.find(comment => comment._id === commentId).likes.includes(user._id)
        ? likeComment
        : unlikeComment;

      await dispatch(action(commentId)).unwrap();

      notification.success({ message: `Like ${updatedComments.find(comment => comment._id === commentId).likes.includes(user._id) ? 'dado' : 'quitado'} con éxito` });
    } catch (error) {
      console.error('Error al dar like al comentario:', error);
      notification.error({ message: 'Error al dar like al comentario', description: error.message });
    }
  };

  const handleEditComment = (commentId, currentComment) => {
    setEditingCommentId(commentId);
    setCommentText(currentComment);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsService.deleteComment(commentId);
      notification.success({ message: 'Comentario eliminado con éxito' });
      await fetchComments(); // Actualizar la lista de comentarios
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      notification.error({ message: 'Error al eliminar comentario', description: error.message });
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>No se encontró el post.</div>;
  }

  return (
    <div className="post-detail-container">
      <Card className="post-card">
        {post.imageUrl ? (
          <img alt="example" src={post.imageUrl} className="post-image" />
        ) : null}
        <Meta title={post.title} description={post.body} />
        <div className="post-meta">
          <p>
            <strong>Publicado por:</strong> {post.userId ? post.userId.username : "Usuario desconocido"}
            {post.userId && post.userId._id !== user?._id && (
              <FollowButton targetUserId={post.userId._id} />
            )}
          </p>
        </div>
        <div>
          <Button className="like-button" onClick={handlePostLike}>
            {likedPost ? <HeartFilled/> : <HeartOutlined />} 
            {likesCount} Likes
          </Button>
        </div>
      </Card>

      <h2 className='comment-title'>Comentarios:</h2>
      <div className="comment-section">
        <TextArea
          className="comment-input"
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Escribe un comentario..."
        />
        <Button className="comment-button" onClick={handleCommentSubmit} type="primary">
          {editingCommentId ? 'Actualizar Comentario' : 'Enviar'}
        </Button>
      </div>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment._id} className="comment-card">
              <Meta title={comment.userId ? comment.userId.username : "Usuario desconocido"} description={comment.comment} />
              <div className="comment-content">
                <Button className="like-button" onClick={() => handleCommentLike(comment._id)}>
                  {comment.likes && comment.likes.includes(user?._id) ? <LikeFilled/> : <LikeOutlined />} 
                  {comment.likes ? comment.likes.length : 0} Likes
                </Button>
                <Button onClick={() => handleEditComment(comment._id, comment.comment)}><EditOutlined/>Editar</Button>
                <Button onClick={() => handleDeleteComment(comment._id)}><DeleteOutlined/>Eliminar</Button>
              </div>
            </Card>
          ))
        ) : (
          <div>No hay comentarios aún.</div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
