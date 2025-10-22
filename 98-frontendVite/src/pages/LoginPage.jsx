import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn } from 'lucide-react'; // Ícone para o botão

function LoginPage({ setUser }) {
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Função para simular a formatação do telefone enquanto digita
  const formatPhoneNumber = (input) => {
    // Remove tudo que não for dígito
    const digits = input.replace(/\D/g, '');
    let formatted = '';

    if (digits.length > 0) {
      formatted = '(' + digits.substring(0, 2);
    }
    if (digits.length > 2) {
      formatted += ') ' + digits.substring(2, 7);
    }
    if (digits.length > 7) {
      formatted += '-' + digits.substring(7, 11);
    }
    return formatted;
  };

  useEffect(() => {
    // Tenta carregar informações de login salvas para auto-login
    const savedInfo = localStorage.getItem('volunteerInfo');
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo);
      
      // Simula um carregamento rápido (melhor UX do que redirecionar instantaneamente)
      setLoading(true); 
      setTimeout(() => {
        setUser(parsedInfo);
        navigate('/'); // Redireciona se já estiver logado
      }, 500); 
    }
  }, [setUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Remove caracteres não numéricos antes de enviar para o backend
      const cleanTelefone = telefone.replace(/\D/g, ''); 
      
      const response = await axios.post(`/volunteer/login`, null, {
        params: { telefone: cleanTelefone }
      });

      const userData = response.data;
      
      // Salva as informações no estado e no localStorage (para persistência/auto-login)
      const volunteerInfo = {
        id: userData.id,
        nome: userData.nome,
        funcao: userData.funcao,
        telefone: cleanTelefone
      };
      
      setUser(volunteerInfo);
      localStorage.setItem('volunteerInfo', JSON.stringify(volunteerInfo));
      
      navigate('/'); // Navega para o Dashboard
      
    } catch (err) {
      // Erro de rede ou erro 401/400 retornado pelo backend
      const message = err.response?.data || 'Erro ao conectar com o servidor. Verifique o backend.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login Catraca Santa</h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          Identifique-se com seu número de telefone para acessar a plataforma.
        </p>

        {/* Verifica se está carregando para auto-login */}
        {loading && !error && (
            <div className="text-center text-indigo-600 mb-4">
                Tentando auto-login...
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
              Telefone (Apenas números)
            </label>
            <input
              id="telefone"
              type="tel"
              name="telefone"
              // Aplica a formatação visual ao valor (mantém a lógica simples no estado)
              value={formatPhoneNumber(telefone)}
              onChange={(e) => setTelefone(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              placeholder="Ex: (11) 98765-4321"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
              <span className="block">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            disabled={loading}
          >
            {loading ? 'Acessando...' : 'Entrar'}
            {!loading && <LogIn size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
