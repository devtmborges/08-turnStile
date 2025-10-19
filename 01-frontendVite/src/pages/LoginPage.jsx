import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// A URL base está configurada no App.jsx para simplificar

function LoginPage({ setUser }) {
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Tenta carregar informações de login salvas
    const savedInfo = localStorage.getItem('volunteerInfo');
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo);
      setUser(parsedInfo);
      navigate('/'); // Redireciona se já estiver logado
    }
  }, [setUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Faz a requisição POST para o endpoint de login
      const response = await axios.post(`/volunteer/login`, null, {
        params: { telefone: telefone.replace(/\D/g, '') } // Remove caracteres não numéricos
      });

      const userData = response.data;
      
      // Salva as informações no estado e no localStorage
      const volunteerInfo = {
        id: userData.id,
        nome: userData.nome,
        funcao: userData.funcao,
        telefone: telefone
      };
      
      setUser(volunteerInfo);
      localStorage.setItem('volunteerInfo', JSON.stringify(volunteerInfo));
      
      navigate('/'); // Navega para o Dashboard
      
    } catch (err) {
      // Usa o 'err.response?.data' que é o corpo da resposta de erro do Spring
      const message = err.response?.data || 'Erro ao conectar com o servidor. Verifique o backend.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login do Voluntário</h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          Identifique-se com seu número de telefone para acessar a plataforma de registro.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
              Telefone (apenas números)
            </label>
            <input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              placeholder="Ex: 11987654321"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Acessando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;