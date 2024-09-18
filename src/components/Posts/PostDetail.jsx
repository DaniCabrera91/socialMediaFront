import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getById, updatePost } from '../../redux/posts/postsSlice';

const PostDetail = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { post } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    body: '',
  });

  useEffect(() => {
    dispatch(getById(_id));
  }, [dispatch, _id]);

  useEffect(() => {
    if (post) {
      setEditData({
        title: post.title,
        body: post.body,
      });
      console.log(post.imageUrl);  // Verificar la URL de la imagen
    }
  }, [post]);

  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onEditSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updatePost({ id: _id, postData: editData }));
    setIsEditing(false);
  };

  return (
    <div>
      <h1>PostDetail</h1>
      {isEditing ? (
        <form onSubmit={onEditSubmit}>
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={onEditChange}
          />
          <textarea
            name="body"
            value={editData.body}
            onChange={onEditChange}
          />
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
        </form>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} style={{ width: '500px', height: 'auto' }} />
          )}
          {user && post.author === user._id && (
            <button onClick={() => setIsEditing(true)}>Editar</button>
          )}
        </>
      )}
    </div>
  );
};

export default PostDetail;
