import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../redux/auth/authSlice';
import { notification, Upload, Avatar } from 'antd';
import './Register.styled.scss'

const Register = () => {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    username: '', 
    email: '', 
    password: '', 
    password2: '', 
    profileImage: null, // Nuevo campo para la imagen de perfil
    previewImageUrl: ''  // URL para mostrar la vista previa de la imagen
  });
  
  const { firstName, username, email, password, password2, profileImage, previewImageUrl } = formData;
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
    };
  }, [isSuccess, isError, message, dispatch]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (info) => {
    if (info.fileList && info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      setFormData({
        ...formData,
        profileImage: file,
        previewImageUrl: URL.createObjectURL(file),
      });
    }
  };

  const onSubmit = (e) => {
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
      const updatedData = new FormData();
      updatedData.append('firstName', firstName);
      updatedData.append('username', username);
      updatedData.append('email', email);
      updatedData.append('password', password);
      updatedData.append('profileImage', profileImage); // Agrega la imagen de perfil a la solicitud
      return dispatch(register(updatedData)); // Envía `updatedData` en lugar de `formData`
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
      previewImageUrl: ''
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Upload
        name="profileImage"
        beforeUpload={() => false}
        onChange={handleImageChange}
        showUploadList={false}
      >
        <div>
          <Avatar
            src={previewImageUrl || 'default-avatar.png'} // Ruta a una imagen por defecto
            size={128}
          />
          <span>Seleccionar Imagen</span>
        </div>
      </Upload>
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
  );
};

export default Register;
