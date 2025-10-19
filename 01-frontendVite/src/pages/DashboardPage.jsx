import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle } from 'lucide-react'; // Importa os novos ícones

function DashboardPage({ user, onLogout }) {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState(''); // Estado para o serviço selecionado

    // Lista de serviços (mantida)
    const serviceOptions = [
        "Registro", "Aconselhamento em assistência social", "Aconselhamento jurídico",
        "Consulta odonto", "Cabeleireiro", "Consulta pediatra",
        "Lanche", "Serviços gerais", "Orientação",
        "Oficina 1", "Oficina 2", "Oficina 3", "Oficina 4",
        "Oficina 5", "Oficina 6", "Oficina 7", "Oficina 8", "Oficina 9"
    ];

    const handleServiceSelect = (serviceName) => {
        if (serviceName) {
            navigate(`/service/${serviceName}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            {/* Header Fixo e Estilizado */}
            <header className="bg-white shadow-lg rounded-xl p-4 mb-6 sticky top-4 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        {/* NOME DO PROJETO ATUALIZADO */}
                        <h1 className="text-2xl font-extrabold text-indigo-700">Catraca Santa</h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Olá, **{user.nome || 'Voluntário'}** ({user.funcao || 'N/A'})
                        </p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition shadow-md"
                    >
                        Sair
                    </button>
                </div>
            </header>

            {/* Removido max-w-xl para maior fluidez no mobile (100% da largura) */}
            <main className="mx-auto space-y-8 max-w-xl">
                
                {/* 1. Registro de Entrada (Card Prioritário) */}
                <div className="p-6 bg-white rounded-xl shadow-xl border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        {/* ÍCONE CORRIGIDO: Users (Grupo/Família) */}
                        <Users className="h-6 w-6 text-blue-500 mr-2" />
                        1. Registro de Entrada
                    </h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        Cadastre o Responsável e a(s) Criança(s) para emitir o QR Code de atendimento.
                    </p>
                    <button
                        onClick={() => navigate('/register-group')}
                        className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition shadow-lg transform hover:scale-[1.01]"
                    >
                        Cadastrar Novo Grupo Familiar
                    </button>
                </div>

                {/* 2. Registro de Atendimento (Lista Suspensa) */}
                <div className="p-6 bg-white rounded-xl shadow-xl border-t-4 border-green-500">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        {/* ÍCONE CORRIGIDO: CheckCircle (Serviço/Conclusão) */}
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                        2. Registrar Atendimento (Lista Suspensa)
                    </h2>
                    
                    <div className="space-y-4">
                        <label htmlFor="service-select" className="block text-sm font-medium text-gray-700">
                            Selecione o serviço que você está prestando:
                        </label>
                        <select
                            id="service-select"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg rounded-lg shadow-md"
                        >
                            <option value="" disabled>-- Escolha um serviço --</option>
                            {serviceOptions.map((service) => (
                                <option key={service} value={service}>
                                    {service}
                                </option>
                            ))}
                        </select>
                        
                        <button
                            onClick={() => handleServiceSelect(selectedService)}
                            disabled={!selectedService}
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg disabled:bg-gray-400 disabled:shadow-none"
                        >
                            Ir para Registro
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;