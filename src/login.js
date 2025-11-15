import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/filmes');
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Filmes e Séries</h1>
      <button onClick={login} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Entrar com Google
      </button>
    </div>
  );
}

export default Login;