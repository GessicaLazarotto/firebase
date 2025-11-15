import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Filmes() {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('filme');
  const [lista, setLista] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        carregarDados(u.uid);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const carregarDados = async (userId) => {
    const q = query(collection(db, 'filmes'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    setLista(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!titulo) return alert('Digite o título');
    
    if (editandoId) {
      await updateDoc(doc(db, 'filmes', editandoId), { titulo, tipo });
    } else {
      await addDoc(collection(db, 'filmes'), { titulo, tipo, userId: user.uid });
    }
    
    setTitulo('');
    setTipo('filme');
    setEditandoId(null);
    carregarDados(user.uid);
  };

  const apagar = async (id) => {
    if (!window.confirm('Apagar?')) return;
    await deleteDoc(doc(db, 'filmes', id));
    carregarDados(user.uid);
  };

  const editar = (item) => {
    setTitulo(item.titulo);
    setTipo(item.tipo);
    setEditandoId(item.id);
  };

  const sair = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Filmes e Séries</h1>
        <button onClick={sair}>Sair</button>
      </div>
      
      <form onSubmit={salvar} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
        <input 
          type="text" 
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Título"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="filme">Filme</option>
          <option value="serie">Série</option>
        </select>
        
        <button type="submit">{editandoId ? 'Salvar' : 'Adicionar'}</button>
        
        {editandoId && (
          <button type="button" onClick={() => { setTitulo(''); setEditandoId(null); }} style={{ marginLeft: '5px' }}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Lista ({lista.length})</h2>
      
      {lista.length === 0 ? (
        <p>Nenhum item</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {lista.map(item => (
            <li key={item.id} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '5px' }}>
              <strong>{item.titulo}</strong> - {item.tipo}
              <div style={{ float: 'right' }}>
                <button onClick={() => editar(item)} style={{ marginRight: '5px' }}>Editar</button>
                <button onClick={() => apagar(item.id)}>Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Filmes;