import { useSelector } from 'react-redux';

const Profile = () => {

  const { user } = useSelector((state) => state.auth);
  console.log('Contenido del usuario en perfil',user);

  
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Profile</h1>
      <p>{user.firstName}</p>
      <p>{user.email}</p>
      {user.profileImageUrl && (
        <img src={user.profileImageUrl} alt={user.firstName} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
      )}
    </>
  );
};

export default Profile;
