import React, { useState } from 'react';

function TextoVoz({ aoTranscrever }) {
  const [gravando, setGravando] = useState(false);
  const [reconhecimento, setReconhecimento] = useState(null);

  const iniciarGravacao = () => {
    const ReconhecimentoDeVoz = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!ReconhecimentoDeVoz) {
      alert('Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge.');
      return;
    }

    const rec = new ReconhecimentoDeVoz();
    rec.lang = 'pt-BR';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setGravando(true);
    };

    rec.onresult = (evento) => {
      const transcricao = evento.results[0][0].transcript;
      aoTranscrever(transcricao);
      setGravando(false);
    };

    rec.onerror = (evento) => {
      console.error('Erro:', evento.error);
      alert('Erro ao reconhecer voz: ' + evento.error);
      setGravando(false);
    };

    rec.onend = () => {
      setGravando(false);
    };

    rec.start();
    setReconhecimento(rec);
  };

  const pararGravacao = () => {
    if (reconhecimento) {
      reconhecimento.stop();
    }
    setGravando(false);
  };

  return (
    <button 
      onClick={gravando ? pararGravacao : iniciarGravacao}
      style={{ 
        padding: '10px 20px',
        backgroundColor: gravando ? '#f44336' : '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '10px'
      }}
    >
      {gravando ? 'Parar' : 'Falar'}
    </button>
  );
}

export default TextoVoz;