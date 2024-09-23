import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../redux/auth/authService'

const TokenVerifier = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = authService.getToken()
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  return children
}

export default TokenVerifier