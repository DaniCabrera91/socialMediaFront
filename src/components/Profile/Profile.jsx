import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPosts } from '../../redux/posts/postsSlice';
import { updateUser, reset } from '../../redux/auth/authSlice'; 
import { Tabs, Spin, Avatar, Input, Button, Upload, notification, Card } from 'antd'; 

const { Meta } = Card;

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { posts, isLoading } = useSelector((state) => state.posts);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    username: '', // Cambiado a "username" en lugar de "userName"
    email: '',
    profileImage: null,
    previewImageUrl: '',
  });

  const { firstName, username, email, profileImage, previewImageUrl } = formData;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        username: user.username || '', // Cambiado a "username" en lugar de "userName"
        email: user.email || '',
        previewImageUrl: user.profileImageUrl || '',
      });
    }
  }, [user]); 

  useEffect(() => {
    if (isError) {
      notification.error({ message: 'Error', description: message });
    }
    if (isSuccess) {
      notification.success({ message: 'Success', description: 'Perfil actualizado con éxito' });
      setIsEditing(false); 
    }

    return () => {
      dispatch(reset()); 
    };
  }, [isError, isSuccess, message, dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (info) => {
    if (info.fileList && info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj; 
      setFormData({
        ...formData,
        profileImage: file,
        previewImageUrl: URL.createObjectURL(file),
      });
    }
  };

  const onSubmit = () => {
    const updatedData = new FormData();
    updatedData.append('firstName', firstName);
    updatedData.append('username', username); // Cambiado a "username"
    updatedData.append('email', email);
    if (profileImage) {
      updatedData.append('profileImage', profileImage);
    }
    dispatch(updateUser({ id: user._id, data: updatedData }));
  };

  const items = [
    {
      key: '1',
      label: 'Perfil',
      children: (
        <div className="profile-info">
          {isEditing ? (
            <>
              <Upload
                name="profileImage"
                beforeUpload={() => false}
                onChange={handleImageChange} 
                showUploadList={false}
              >
                <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={previewImageUrl || user?.profileImageUrl} 
                    size={128}
                  />
                  <span style={{ marginTop: '5px', color: '#1890ff' }}>Cambiar Imagen</span> {/* Indicador visual */}
                </div>
              </Upload>
              <Input
                name="firstName"
                value={firstName}
                onChange={handleInputChange}
                placeholder="Nombre"
                style={{ marginBottom: '10px' }}
              />
              <Input
                name="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Nombre de Usuario"
                style={{ marginBottom: '10px' }}
              />
              <Input
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
                style={{ marginBottom: '10px' }}
              />
              <Button type="primary" onClick={onSubmit}>Guardar</Button>
              <Button onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>Cancelar</Button>
            </>
          ) : (
            user ? (
              <>
                <Avatar src={user.profileImageUrl} alt={user.firstName} size={128} style={{ marginBottom: '20px' }} />
                <p><strong>Nombre:</strong> {user.firstName}</p>
                <p><strong>Nombre de Usuario:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <Button type="primary" onClick={() => setIsEditing(true)}>Editar Perfil</Button>
              </>
            ) : (
              <p>Por favor, inicia sesión para ver tu perfil.</p>
            )
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Posts',
      children: (
        <>
          <h2>Posts Creados</h2>
          {isLoading ? (
            <Spin /> 
          ) : posts.length > 0 ? (
            <div className="posts-list">
              {posts.map((post) => (
                <Card key={post._id} cover={post.imageUrl && <img alt={post.title} src={post.imageUrl} />}>
                  <Meta title={post.title} description={post.body} />
                </Card>
              ))}
            </div>
          ) : (
            <p>No hay posts creados por este usuario.</p>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="profile-container">
      <h1>Perfil</h1>
      <Tabs items={items} defaultActiveKey="1" />
    </div>
  );
};

export default Profile;
