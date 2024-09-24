import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserPosts, updatePost, deletePost } from '../../redux/posts/postsSlice' // Importa las acciones necesarias
import { updateUser, reset } from '../../redux/auth/authSlice' 
import { Tabs, Spin, Avatar, Input, Button, Upload, notification, Card, Modal } from 'antd' 

const { Meta } = Card

const Profile = () => {
  const dispatch = useDispatch()
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth)
  const { posts, isLoading } = useSelector((state) => state.posts)

  // Estados para la edición de perfil y publicaciones
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    email: '',
    profileImage: null,
    previewImageUrl: '',
    postTitle: '',
    postBody: '',
    postImage: null,
  })

  const { firstName, username, email, profileImage, previewImageUrl, postTitle, postBody, postImage } = formData

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        username: user.username || '',
        email: user.email || '',
        previewImageUrl: user.profileImageUrl || '',
      })
      dispatch(getUserPosts(user._id)) // Cargar publicaciones del usuario
    }
  }, [user, dispatch])

  useEffect(() => {
    if (isError) {
      notification.error({ message: 'Error', description: message })
    }
    if (isSuccess) {
      notification.success({ message: 'Éxito', description: 'Perfil actualizado con éxito' })
      setIsEditingProfile(false) 
    }

    return () => {
      dispatch(reset())
    }
  }, [isError, isSuccess, message, dispatch])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (info) => {
    if (info.fileList && info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj 
      setFormData({
        ...formData,
        profileImage: file,
        previewImageUrl: URL.createObjectURL(file),
      })
    }
  }

  const onSubmitProfile = () => {
    const updatedData = new FormData()
    updatedData.append('firstName', firstName)
    updatedData.append('username', username)
    updatedData.append('email', email)
    if (profileImage) {
      updatedData.append('profileImage', profileImage)
    }
    dispatch(updateUser({ id: user._id, data: updatedData }))
  }

  const onSubmitPost = () => {
    const updatedData = new FormData()
    updatedData.append('title', postTitle)
    updatedData.append('body', postBody)
    if (postImage) {
      updatedData.append('image', postImage)
    }

    if (currentPost) {
      dispatch(updatePost({ id: currentPost._id, data: updatedData }))
        .unwrap()
        .then(() => {
          notification.success({ message: 'Post actualizado correctamente' })
          resetPostForm()
          dispatch(getUserPosts(user._id))
          setIsEditingPost(false)
        })
        .catch((error) => {
          notification.error({ message: 'Error', description: error })
        })
    } else {
      // Aquí puedes manejar la creación de un nuevo post
      // dispatch(createPost(updatedData)) // Si tienes una acción para crear un post
    }
  }

  const resetPostForm = () => {
    setCurrentPost(null)
    setFormData({ ...formData, postTitle: '', postBody: '', postImage: null })
  }

  const handleEditPost = (post) => {
    setCurrentPost(post)
    setFormData({
      postTitle: post.title,
      postBody: post.body,
      postImage: null,
    })
    setIsEditingPost(true)
  }

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId))
      .unwrap()
      .then(() => {
        notification.success({ message: 'Post eliminado correctamente' })
        dispatch(getUserPosts(user._id))
      })
      .catch((error) => {
        notification.error({ message: 'Error', description: error })
      })
  }

  const items = [
    {
      key: '1',
      label: 'Perfil',
      children: (
        <div className="profile-info">
          {isEditingProfile ? (
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
                  <span style={{ marginTop: '5px', color: '#1890ff' }}>Cambiar Imagen</span>
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
              <Button type="primary" onClick={onSubmitProfile}>Guardar</Button>
              <Button onClick={() => setIsEditingProfile(false)} style={{ marginLeft: '10px' }}>Cancelar</Button>
            </>
          ) : (
            user ? (
              <>
                <Avatar src={user.profileImageUrl} alt={user.firstName} size={128} style={{ marginBottom: '20px' }} />
                <p><strong>Nombre:</strong> {user.firstName}</p>
                <p><strong>Nombre de Usuario:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <Button type="primary" onClick={() => setIsEditingProfile(true)}>Editar Perfil</Button>
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
                  <Button onClick={() => handleEditPost(post)} style={{ marginTop: '10px' }}>Editar</Button>
                  <Button onClick={() => handleDeletePost(post._id)} style={{ marginLeft: '10px' }}>Eliminar</Button>
                </Card>
              ))}
            </div>
          ) : (
            <p>No hay posts creados por este usuario.</p>
          )}
          <Button type="primary" onClick={() => {
            resetPostForm()
            setIsEditingPost(true) // Para crear un nuevo post
          }}>Crear Nuevo Post</Button>
        </>
      ),
    },
  ]

  return (
    <div className="profile-container">
      <h1>Perfil</h1>
      <Tabs items={items} defaultActiveKey="1" />

      <Modal
        title={currentPost ? "Editar Post" : "Crear Nuevo Post"}
        open={isEditingPost}
        onCancel={() => {
          setIsEditingPost(false)
          resetPostForm()
        }}
        footer={null}
      >
        <form onSubmit={(e) => { 
          e.preventDefault()
          onSubmitPost()
          }}>
          <Input
            name="postTitle"
            value={postTitle}
            onChange={handleInputChange}
            placeholder="Título del Post"
            style={{ marginBottom: '10px' }}
          />
          <Input.TextArea
            name="postBody"
            value={postBody}
            onChange={handleInputChange}
            placeholder="Contenido del Post"
            rows={4}
            style={{ marginBottom: '10px' }}
          />
          <Upload
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.fileList && info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj
                setFormData({
                  ...formData,
                  postImage: file,
                })
              }
            }}
            showUploadList={false}
          >
            <Button>Seleccionar Imagen</Button>
          </Upload>
          <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }}>Guardar Post</Button>
        </form>
      </Modal>
    </div>
  )
}

export default Profile
