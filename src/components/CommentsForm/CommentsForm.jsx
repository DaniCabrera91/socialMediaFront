import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComment, getCommentsByPost } from '../../redux/comments/commentsSlice'; // Importar las acciones de comentarios
import { Input, Button, notification } from 'antd';

const { TextArea } = Input;

const CommentsForm = ({ postId }) => {
  const [newComment, setNewComment] = useState(""); // Estado local para el nuevo comentario
  const dispatch = useDispatch();

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      return notification.warning({ message: 'El comentario no puede estar vacío' });
    }

    try {
      await dispatch(createComment({ comment: newComment, postId })).unwrap();
      setNewComment(""); // Limpiar el campo del comentario
      dispatch(getCommentsByPost(postId)); // Refrescar los comentarios del post
      notification.success({ message: 'Comentario publicado con éxito' });
    } catch (error) {
      notification.error({ message: 'Error al publicar el comentario', description: error.message });
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <TextArea
        rows={4}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Añadir un comentario"
      />
      <Button type="primary" onClick={handleCommentSubmit} style={{ marginTop: '10px' }}>
        Publicar Comentario
      </Button>
    </div>
  );
};

export default CommentsForm;
