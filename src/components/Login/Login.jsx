import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { login, reset } from '../../redux/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { notification } from 'antd'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch() 
    
    const { isError, isSuccess, message, user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (isError) {
            notification.error({ message: 'Error', description: message })
        }

        if (isSuccess && user) {
            notification.success({ message: 'Success', description: message })
            setTimeout(() => {
                navigate('/profile')
            }, 2000)
        }

        // Limpia los mensajes después de que se muestre la notificación
        return () => {
            dispatch(reset())  // Esto limpia el estado solo al desmontar el componente
        }
    }, [isError, isSuccess, message, user, navigate, dispatch])

    const [formData, setFormData] = useState({ 
        email:'', 
        password:'' 
    })
    
    const {email, password} = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(login(formData))
    }
    
    return (
        <form onSubmit={onSubmit}>
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
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    )
}

export default Login
