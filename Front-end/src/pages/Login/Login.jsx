import { useState } from 'react';
import axios        from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [login, setLogin]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  /* порт саме бекенда */
  const API_URL = 'http://localhost:8080';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login || !password) return setError('Заповніть всі поля!');

    try {
      const res = await axios.post(`${API_URL}/user/login`, { login, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      if (err.response?.status === 401) setError('Невірний логін або пароль');
      else                             setError('Помилка сервера. Спробуйте пізніше.');
    }
  };


  return (
    <div style={{ maxWidth: 300, margin: 'auto', textAlign: 'center' }}>
      <h2>Вхід в адмін-панель</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text" placeholder="Логін"
          value={login}
          onChange={(e) => { setLogin(e.target.value); setError(''); }}
          required
        /><br/>
        <input
          type="password" placeholder="Пароль"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          required
        /><br/>
        <button type="submit" disabled={!login || !password}>Увійти</button>
      </form>
    </div>
  );
};

export default Login;
