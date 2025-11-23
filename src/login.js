import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { autenticacao, provedorGoogle } from './firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navegar = useNavigate();

  const fazerLogin = async () => {
    try {
      await signInWithPopup(autenticacao, provedorGoogle);
      navegar('/filmes');
    } catch (erro) {
      alert('Erro ao fazer login: ' + erro.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Filmes e Séries</h1>
      <button onClick={fazerLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Entrar com Google
      </button>
    </div>
  );
}

export default Login;