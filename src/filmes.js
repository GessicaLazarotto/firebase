import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { bancoDados, autenticacao } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import TextoVoz from './TextoVoz';

function Filmes() {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('filme');
  const [lista, setLista] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const navegar = useNavigate();

  useEffect(() => {
    const cancelarInscricao = onAuthStateChanged(autenticacao, (u) => {
      if (u) {
        setUsuario(u);
        carregarDados(u.uid);
      } else {
        navegar('/');
      }
    });
    return () => cancelarInscricao();
  }, [navegar]);

  const carregarDados = async (idUsuario) => {
    const consulta = query(collection(bancoDados, 'filmes'), where('userId', '==', idUsuario));
    const instantaneo = await getDocs(consulta);
    setLista(instantaneo.docs.map(documento => ({ id: documento.id, ...documento.data() })));
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!titulo) return alert('Digite o título');
    
    if (editandoId) {
      await updateDoc(doc(bancoDados, 'filmes', editandoId), { titulo, tipo });
    } else {
      await addDoc(collection(bancoDados, 'filmes'), { titulo, tipo, userId: usuario.uid });
    }
    
    setTitulo('');
    setTipo('filme');
    setEditandoId(null);
    carregarDados(usuario.uid);
  };

  const apagar = async (id) => {
    if (!window.confirm('Deseja apagar?')) return;
    await deleteDoc(doc(bancoDados, 'filmes', id));
    carregarDados(usuario.uid);
  };

  const editar = (item) => {
    setTitulo(item.titulo);
    setTipo(item.tipo);
    setEditandoId(item.id);
  };

  const aoReceberTranscricao = (texto) => {
    setTitulo(texto);
  };

  const sair = async () => {
    await signOut(autenticacao);
    navegar('/');
  };

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Filmes e Séries</h1>
        <button onClick={sair}>Sair</button>
      </div>
      
      <form onSubmit={salvar} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input 
            type="text" 
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Título (ou clique no microfone)"
            style={{ width: '100%', padding: '8px' }}
          />
          <TextoVoz aoTranscrever={aoReceberTranscricao} />
        </div>
        
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

      <h2>Minha Lista ({lista.length})</h2>
      
      {lista.length === 0 ? (
        <p>Nenhum item adicionado</p>
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