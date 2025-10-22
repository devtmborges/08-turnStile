// O 'main.jsx' é o ponto de entrada da aplicação React/Vite.
// Ele injeta o componente App.jsx no elemento 'root' do index.html.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O BrowserRouter é NECESSÁRIO para que as rotas do App.jsx funcionem */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// INSTRUÇÕES PÓS-INICIALIZAÇÃO:
// Para acessar a aplicação (após iniciar o Vite com 'npm run dev'), use a URL base.
// O App.jsx redireciona automaticamente para a tela de Login.
// URL de Acesso: http://localhost:5173/