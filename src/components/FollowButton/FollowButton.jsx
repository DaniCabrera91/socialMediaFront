import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser, reset } from '../../redux/auth/authSlice';
import { Button, notification } from 'antd';
import './FollowButton.styled.scss'

const FollowButton = ({ targetUserId }) => {
  const dispatch = useDispatch();
  const { user, message: authMessage, isError, isSuccess } = useSelector((state) => state.auth);
  const isFollowing = user && user.follows.includes(targetUserId);
  const isSelf = user && user._id === targetUserId;

  const [loading, setLoading] = useState(false); // Estado de carga
  const hasNotified = useRef(false);

  const handleFollow = async () => {
    if (isSelf) {
      notification.warning({ message: 'No puedes seguirte a ti mismo' });
      return;
    }

    setLoading(true);

    try {
      if (isFollowing) {
        await dispatch(unfollowUser(targetUserId)).unwrap();
      } else {
        await dispatch(followUser(targetUserId)).unwrap();
      }
    } catch (error) {
      notification.error({ message: 'Error al cambiar el estado de seguimiento', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess && authMessage && !hasNotified.current) {
      notification.success({ message: authMessage });
      hasNotified.current = true; // Marcar como notificado
      dispatch(reset());
    }

    if (isError && authMessage && !hasNotified.current) {
      notification.error({ message: authMessage });
      hasNotified.current = true; // Marcar como notificado
      dispatch(reset());
    }

    return () => {
      hasNotified.current = false; // Reiniciar la notificación
    };
  }, [isSuccess, isError, authMessage, dispatch]);

  return (
    <Button onClick={handleFollow} disabled={isSelf || loading} className='folowButton'>
      {loading ? 'Cargando...' : (isSelf ? 'No puedes seguirte' : (isFollowing ? 'Dejar de seguir' : 'Seguir'))}
    </Button>
  );
}

export default FollowButton;
