import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../../redux/auth/authSlice';
import { notification } from 'antd';

const FollowButton = ({ targetUserId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Verifica que el usuario esté cargado
  if (!user) {
    return null; // O un botón deshabilitado, o un mensaje de carga
  }

  const isFollowing = user.follows.includes(targetUserId);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(targetUserId));
        notification.success({ message: 'Dejado de seguir con éxito' });
      } else {
        await dispatch(followUser(targetUserId));
        notification.success({ message: 'Siguiendo con éxito' });
      }
    } catch (error) {
      notification.error({ message: 'Error al seguir/dejar de seguir', description: error.message });
    }
  };

  return (
    <button onClick={handleFollow} style={{ cursor: 'pointer' }}>
      {isFollowing ? 'Dejar de seguir' : 'Seguir'}
    </button>
  );
};

export default FollowButton;
