import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register, reset } from '../../redux/auth/authSlice'
import { notification } from 'antd'

const Register = () => {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    username: '', 
    email: '', 
    password: '', 
    password2: '' 
  })
  
  const { firstName, username, email, password, password2 } = formData
  const dispatch = useDispatch()
  const { isSuccess, message, isError } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: 'Success',
        description: message,
      })
    }
    if (isError) {
      notification.error({ message: 'Error', description: message })
    }

    return () => {
      dispatch(reset())  // Asegúrate de resetear solo cuando el componente se desmonte
    }
  }, [isSuccess, isError, message, dispatch])

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      return notification.error({
        message: 'Error',
        description: 'Passwords do not match',
      })
    } else if (!firstName || !username || !email || !password || !password2) {
      return notification.error({
        message: 'Error',
        description: 'All fields are required',
      })
    } else {
      return dispatch(register(formData))
    }
  }

  const clearForm = () => {
    setFormData({
      firstName: '',
      username: '',
      email: '',
      password: '',
      password2: ''
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="firstName"
        value={firstName}
        onChange={onChange}
        placeholder="Nombre"
        required
      />
      <input
        type="text"
        name="username"
        value={username}
        onChange={onChange}
        placeholder="Nombre de usuario"
        required
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Contraseña"
        required
      />
      <input
        type="password"
        name="password2"
        value={password2}
        onChange={onChange}
        placeholder="Confirma la contraseña"
        required
      />
      <div>
        <button type="submit">Registrar</button>
        <button type="button" onClick={clearForm}>Limpiar Formulario</button>
      </div>
    </form>
  )
}

export default Register
