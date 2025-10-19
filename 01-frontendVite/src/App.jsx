// 01-frontendVite/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RegisterGroupPage from './pages/RegisterGroupPage.jsx';
import ServicePage from './pages/ServicePage.jsx'; // Corrigir este também!
import { useState, useEffect } from 'react';
import axios from 'axios';

// Configura o baseURL para todas as requisições, simplificando o código das páginas
axios.defaults.baseURL = 'http://localhost:8080/api'; 

// Um DTO simples para o usuário logado
const initialUserState = {
  id: null,
  nome: null,
  funcao: null,
  telefone: null
};

function App() {
  const [user, setUser] = useState(initialUserState);
  
  // Tenta carregar o usuário do Local Storage ao iniciar
  useEffect(() => {
    const savedInfo = localStorage.getItem('volunteerInfo');
    if (savedInfo) {
      setUser(JSON.parse(savedInfo));
    }
  }, []);

  // Verifica se o usuário está logado
  const isLoggedIn = user.id !== null;
  
  // Função para fazer logout
  const handleLogout = () => {
    setUser(initialUserState);
    localStorage.removeItem('volunteerInfo');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        {/* Rotas Protegidas (requer login) */}
        {/* O Dashboard e outras páginas redirecionam para /login se não estiver logado */}
        <Route path="/" element={isLoggedIn ? <DashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/register-group" element={isLoggedIn ? <RegisterGroupPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/service/:serviceName" element={isLoggedIn ? <ServicePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        
        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;