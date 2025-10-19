import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCodeScanner from '../components/QRCodeScanner';
import { Camera, Type } from 'lucide-react'; // Ícones para os botões

// URL base já configurada no App.jsx, mas mantemos a constante para clareza
// const API_BASE_URL = 'http://localhost:8080/api'; 

// Dica: Axios já usa a baseURL configurada no App.jsx, simplificando as chamadas.

function ServicePage({ user }) {
    const { serviceName } = useParams();
    const navigate = useNavigate();
    
    // Estados do Fluxo
    const [qrCodeId, setQrCodeId] = useState(null);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    // NOVO ESTADO: Controla o modo de entrada (null = escolha, 'manual', 'camera')
    const [inputMode, setInputMode] = useState(null); 
    const [manualInput, setManualInput] = useState('');

    // --- LÓGICA CENTRAL DE BUSCA DE DADOS (USADA POR AMBOS OS MODOS) ---
    const fetchGroupData = async (id) => {
        const parsedId = parseInt(id);

        if (isNaN(parsedId) || parsedId < 1 || parsedId > 300) {
            setMessage('Erro: ID do QR Code inválido ou fora do intervalo (1-300).');
            return;
        }

        setMessage(`QR Code ${parsedId} lido/digitado. Buscando grupo...`);
        setQrCodeId(parsedId);
        setLoading(true);

        try {
            // A chamada de API será para /assisted/group/{id}
            const response = await axios.get(`/assisted/group/${parsedId}`); 
            setGroup(response.data);
            setMessage(`Grupo de ${response.data.length} pessoa(s) encontrado.`);
            setInputMode(null); // Desativa modos de entrada após o sucesso
        } catch (err) {
            const msg = err.response?.data || 'Erro: QR Code não está registrado na base ou backend falhou.';
            setMessage(`Erro: ${msg}`);
            setQrCodeId(null);
            setGroup(null);
        } finally {
            setLoading(false);
        }
    };
    
    // --- HANDLER PARA INPUT MANUAL ---
    const handleManualSubmit = (e) => {
        e.preventDefault();
        fetchGroupData(manualInput);
    };

    // --- HANDLER PARA LEITURA DA CÂMERA ---
    const handleScanSuccess = (decodedText) => {
        fetchGroupData(decodedText);
    };


    // --- RENDERIZAÇÃO ---
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <header className="pb-4 border-b border-gray-200 flex justify-between items-center max-w-xl mx-auto">
                <h1 className="text-xl font-bold text-green-700">Registrando: {serviceName}</h1>
                <button 
                    onClick={() => navigate('/')} 
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Voltar / Mudar Serviço
                </button>
            </header>

            <main className="mt-6 max-w-xl mx-auto space-y-6">
                
                {/* Mensagens de Status */}
                {message && (
                    <div className={`p-3 rounded-lg text-sm ${message.startsWith('Sucesso') ? 'bg-green-100 text-green-700' : message.startsWith('Erro') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {message}
                    </div>
                )}

                {/* 1. SELEÇÃO DO MODO DE ENTRADA (Aparece se não houver grupo carregado) */}
                {!group && (
                    <div className="p-4 bg-white rounded-xl shadow-lg">
                        <p className="text-center text-gray-700 mb-4 font-semibold">
                            Escolha como deseja inserir o QR Code:
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setInputMode('manual')}
                                className={`flex-1 py-3 text-lg font-bold rounded-lg transition shadow-md flex items-center justify-center ${inputMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                <Type className="h-5 w-5 mr-2" /> Manual
                            </button>
                            <button
                                onClick={() => setInputMode('camera')}
                                className={`flex-1 py-3 text-lg font-bold rounded-lg transition shadow-md flex items-center justify-center ${inputMode === 'camera' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                <Camera className="h-5 w-5 mr-2" /> Câmera
                            </button>
                        </div>
                    </div>
                )}


                {/* 2. INPUT MANUAL (Aparece se o modo for 'manual') */}
                {inputMode === 'manual' && (
                    <form onSubmit={handleManualSubmit} className="p-4 bg-white rounded-xl shadow-lg space-y-4">
                        <label htmlFor="qr-manual" className="block text-sm font-medium text-gray-700">
                            ID do QR Code do Responsável (1-300)
                        </label>
                        <input
                            id="qr-manual"
                            type="number"
                            min="1"
                            max="300"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="Ex: 123"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Carregando...' : 'Carregar Dados do QR'}
                        </button>
                    </form>
                )}

                {/* 3. INPUT CÂMERA (Aparece se o modo for 'camera') */}
                {inputMode === 'camera' && (
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-center text-gray-600 mb-4 font-semibold">Aponte a câmera para o QR Code do RESPONSÁVEL</p>
                        {/* Componente Scanner */}
                        <QRCodeScanner 
                            onScanSuccess={handleScanSuccess} 
                            onScanError={(error) => console.warn(`Scan error: ${error}`)}
                        />
                    </div>
                )}
                
                {/* 4. BLOCO DE CONFIRMAÇÃO E ATENDIMENTO (Aparece se houver grupo carregado) */}
                {group && (
                    <div className="p-6 bg-green-50 rounded-xl shadow-lg border-l-4 border-green-500">
                        <h2 className="text-lg font-bold mb-4">QR Code: {qrCodeId} - Grupo Encontrado</h2>
                        
                        {/* Lista dos Membros do Grupo */}
                        <ul className="space-y-3 mb-6">
                            {group.map((assistedItem, index) => (
                                <li key={assistedItem.id} className={`p-3 rounded-lg flex justify-between items-center ${assistedItem.person.isMinor ? 'bg-gray-100' : 'bg-green-100 font-semibold border border-green-300'}`}>
                                    <div>
                                        <span className="font-semibold text-gray-800 block">{assistedItem.person.nome}</span>
                                        <span className="text-xs text-gray-500">
                                            {assistedItem.person.isMinor ? 'Criança' : 'Responsável (Foco do QR)'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-indigo-600">
                                        (Tel: {assistedItem.person.telefone})
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Botão de Registro de Serviço */}
                        <p className="text-sm text-gray-700 mb-4">
                            Confirme que o serviço **{serviceName}** foi prestado ao grupo.
                        </p>
                        
                        <button
                            onClick={() => {handleRegisterService(); setInputMode(null);}} // Volta ao modo de seleção após registrar
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : `FINALIZAR ATENDIMENTO (${serviceName})`}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ServicePage;
