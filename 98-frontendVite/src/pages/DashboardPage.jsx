import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, CheckCircle, LogOut } from 'lucide-react';

function DashboardPage({ user, onLogout }) {
    const navigate = useNavigate();
    const [serviceOptions, setServiceOptions] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [loadingServices, setLoadingServices] = useState(true);
    const [error, setError] = useState(null);

    // Lista de serviços que você definiu no DataLoader
    const defaultServices = [
        "Registro", "Lanche", "Orientação", "Aconselhamento em assistência social",
        "Aconselhamento jurídico", "Consulta odonto", "Cabeleireiro", 
        "Consulta pediatra", "Serviços gerais", "Oficina 1", "Oficina 9"
    ];

    // Carrega a lista de serviços do backend (ou usa um fallback)
    useEffect(() => {
        const fetchServices = async () => {
            try {
                // NOTE: Você precisaria de um novo endpoint no Java como /api/services
                // Por simplicidade, usaremos a lista estática
                setServiceOptions(defaultServices); 
            } catch (err) {
                console.error("Falha ao carregar serviços do backend, usando lista padrão.", err);
                setServiceOptions(defaultServices);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);


    // Função que lida com a navegação para a página de registro de serviço
    const handleServiceSelect = (e) => {
        const service = e.target.value;
        setSelectedService(service);
        if (service) {
            navigate(`/service/${service}`);
        }
    };

    // Navegação via botão do dropdown
    const handleGoToService = () => {
        if (selectedService) {
            navigate(`/service/${selectedService}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-700">Catraca Santa</h1>
                    <p className="text-sm text-gray-700 mt-1">
                        Olá, **{user.nome}** ({user.funcao})
                    </p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition shadow-md"
                >
                    <LogOut size={16} /> Sair
                </button>
            </header>

            <main className="space-y-8 max-w-xl mx-auto">
                {/* Opção 1: Registro Inicial de Grupo */}
                <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-600">
                    <div className="flex items-center gap-3 mb-4">
                        <UserPlus className="text-blue-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">1. Registro de Entrada</h2>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                        Cadastre o Responsável e as Crianças associadas, atribuindo os QR Codes.
                    </p>
                    <button
                        onClick={() => navigate('/register-group')}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md text-base"
                    >
                        Cadastrar Novo Grupo Familiar
                    </button>
                </div>

                {/* Opção 2: Registro de Atendimento (Lista Suspensa) */}
                <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-600">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="text-green-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">2. Registrar Atendimento</h2>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                        Selecione seu serviço para iniciar o registro por QR Code.
                    </p>
                    
                    <div className="space-y-3">
                        {/* Dropdown de Serviços */}
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-base appearance-none"
                        >
                            <option value="" disabled>-- Escolha um serviço --</option>
                            {loadingServices ? (
                                <option disabled>Carregando serviços...</option>
                            ) : (
                                serviceOptions.map((service) => (
                                    <option key={service} value={service}>
                                        {service}
                                    </option>
                                ))
                            )}
                        </select>
                        
                        {/* Botão de Navegação */}
                        <button
                            onClick={handleGoToService}
                            disabled={!selectedService}
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md text-base disabled:opacity-50"
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
