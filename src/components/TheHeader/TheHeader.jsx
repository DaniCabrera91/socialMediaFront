import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/auth/authSlice'
const TheHeader = () => {
 const navigate = useNavigate()
 const dispatch = useDispatch()
 const { user } = useSelector((state) => state.auth)
 const onLogout = (e) => {
   e.preventDefault()
   dispatch(logout())
   navigate('/login')
 }
 return (
    <nav>
      <h1>header</h1>
      {user ? (
        <>
          <button onClick={onLogout}>Logout</button>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile | {user.name}</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
 }
export default TheHeader