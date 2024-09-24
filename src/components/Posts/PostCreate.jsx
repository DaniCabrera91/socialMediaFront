import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createPost, updatePost } from '../../redux/posts/postsSlice'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

const PostCreate = ({ existingPost }) => {
  const [formData, setFormData] = useState({
    title: existingPost ? existingPost.title : '',
    body: existingPost ? existingPost.body : '',
    image: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const isEditingPost = !!existingPost

  const onChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setFormData((prevState) => ({ ...prevState, image: files[0] }))
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const postData = new FormData()
    postData.append('title', formData.title)
    postData.append('body', formData.body)

    if (formData.image) postData.append('image', formData.image)

    try {
      if (isEditingPost) {
        // Update existing post
        const result = await dispatch(updatePost({ id: existingPost._id, data: postData }))
        if (updatePost.fulfilled.match(result)) {
          notification.success({
            message: 'Éxito',
            description: 'Post actualizado exitosamente',
          })
        } else {
          throw new Error('Error al actualizar el post')
        }
      } else {
        // Create new post
        const result = await dispatch(createPost(postData))
        if (createPost.fulfilled.match(result)) {
          notification.success({
            message: 'Éxito',
            description: 'Post creado exitosamente',
          })
          navigate('/')
        } else {
          throw new Error('Error al crear el post')
        }
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Error al crear o actualizar el post',
      })
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>{isEditingPost ? 'Editar Publicación' : 'Crear Publicación'}</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Título"
          required
        />
        <textarea
          name="body"
          value={formData.body}
          onChange={onChange}
          placeholder="Contenido"
          required
        />
        <input
          type="file"
          name="image"
          onChange={onChange}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cargando...' : isEditingPost ? 'Actualizar Post' : 'Crear Post'}
        </button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}

export default PostCreate
