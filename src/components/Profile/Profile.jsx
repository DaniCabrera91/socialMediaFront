import { useSelector } from 'react-redux'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <p>Loading...</p> // Puedes mostrar un mensaje de carga o un spinner
  }

  return (
    <>
      <h1>Profile</h1>
      <p>{user.firstName}</p>
      <p>{user.email}</p>
      {user.user_img && (
        <img src={`http://localhost:3000/${user.user_img}`} alt={user.firstName} />
      )}
    </>
  )
}

export default Profile
