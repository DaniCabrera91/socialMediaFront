import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../redux/auth/authSlice';
import { notification } from 'antd';

const Register = () => {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    username: '', 
    email: '', 
    password: '', 
    password2: '',
    profileImage: null,
  });

  const { firstName, username, email, password, password2, profileImage } = formData;
  const dispatch = useDispatch();
  const { isSuccess, message, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: 'Success',
        description: message,
      });
    }
    if (isError) {
      notification.error({ message: 'Error', description: message });
    }

    return () => {
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData((prevState) => ({ ...prevState, profileImage: files[0] }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== password2) {
      return notification.error({
        message: 'Error',
        description: 'Passwords do not match',
      });
    } else if (!firstName || !username || !email || !password || !password2) {
      return notification.error({
        message: 'Error',
        description: 'All fields are required',
      });
    } else {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password2', password2);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
  
      dispatch(register(formData));
    }
  };

  const clearForm = () => {
    setFormData({
      firstName: '',
      username: '',
      email: '',
      password: '',
      password2: '',
      profileImage: null,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="firstName"
        value={firstName}
        onChange={onChange}
        placeholder="Nombre"
        required
        autoComplete='off'
      />
      <input
        type="text"
        name="username"
        value={username}
        onChange={onChange}
        placeholder="Nombre de usuario"
        required
        autoComplete='off'
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email"
        required
        autoComplete='off'
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Contraseña"
        required
        autoComplete='off'
      />
      <input
        type="password"
        name="password2"
        value={password2}
        onChange={onChange}
        placeholder="Confirma la contraseña"
        required
        autoComplete='off'
      />
      <input
        type="file"
        name="profileImage"
        onChange={onChange}
      />
      <div>
        <button type="submit">Registrar</button>
        <button type="button" onClick={clearForm}>Limpiar Formulario</button>
      </div>
    </form>
  );
};

export default Register;
