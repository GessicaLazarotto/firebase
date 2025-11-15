import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import Filmes from './filmes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/filmes" element={<Filmes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;