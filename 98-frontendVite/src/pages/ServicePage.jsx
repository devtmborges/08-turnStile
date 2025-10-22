import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCodeScanner from '../components/QRCodeScanner';
import { Camera, List, AlertTriangle } from 'lucide-react'; // Ícones

function ServicePage({ user }) {
    const { serviceName } = useParams();
    const navigate = useNavigate();
    const [qrCodeId, setQrCodeId] = useState('');
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [inputMode, setInputMode] = useState('camera'); // 'camera' | 'manual'

    // --- AÇÃO 1: BUSCA DE GRUPO POR ID (usado por scanner e manual) ---
    const fetchGroupData = async (id) => {
        const parsedId = parseInt(id);

        if (isNaN(parsedId) || parsedId < 1 || parsedId > 300) {
            setMessage('Erro: ID do QR Code inválido ou fora do intervalo (1-300).');
            return;
        }
        
        setMessage(`Buscando grupo para o QR Code ${parsedId}...`);
        setQrCodeId(parsedId);
        setLoading(true);

        try {
            // Busca o grupo familiar associado a este QR Code
            const response = await axios.get(`/assisted/group/${parsedId}`);
            setGroup(response.data); // Recebe a lista de Assisted (Responsável + Crianças)
            setMessage(`Sucesso: Grupo de ${response.data.length} pessoa(s) encontrado.`);
            setInputMode('results'); // Muda o modo para exibir os resultados
        } catch (err) {
            const msg = err.response?.data || 'Erro: QR Code não está registrado na base ou backend falhou.';
            setMessage(`Erro: ${msg}`);
            setQrCodeId('');
            setGroup(null);
        } finally {
            setLoading(false);
        }
    };

    // Callback de sucesso do scanner
    const handleScanSuccess = (decodedText) => {
        // Assume que o texto decodificado é o ID do QR Code
        fetchGroupData(decodedText);
    };

    // Submissão do Input Manual
    const handleManualSubmit = (e) => {
        e.preventDefault();
        fetchGroupData(qrCodeId);
    };


    // --- AÇÃO 2: REGISTRO DO SERVIÇO ---
    const handleRegisterService = async () => {
        if (!user.id || !qrCodeId) {
            setMessage('Erro: Falha de sessão ou QR Code não lido/inserido.');
            return;
        }

        setLoading(true);

        const data = {
            volunteerId: user.id,
            qrCodeId: qrCodeId,
            serviceName: serviceName,
        };

        try {
            const response = await axios.post(`/done-service/register`, data);
            
            // Limpa a tela para o próximo atendimento
            setQrCodeId('');
            setGroup(null);
            setMessage(`Sucesso: ${response.data.split(': ')[1]}`); // Exibe a mensagem de sucesso
            setInputMode('camera'); // Volta para o scanner
            
        } catch (err) {
            const msg = err.response?.data || 'Erro ao registrar serviço.';
            setMessage(`Erro no Registro: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNewScan = () => {
        setQrCodeId('');
        setGroup(null);
        setMessage('');
        setInputMode('camera');
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <header className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
                <h1 className="text-2xl font-bold text-green-700">Atendimento: {serviceName}</h1>
                <button 
                    onClick={() => navigate('/')} 
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                    Voltar
                </button>
            </header>

            <main className="max-w-md mx-auto space-y-6">
                
                {/* Mensagens de Status */}
                {message && (
                    <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${message.startsWith('Sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <AlertTriangle size={20} className="mt-0.5" />
                        <span className="font-medium">{message.split(': ')[0]}:</span>
                        <span>{message.split(': ').length > 1 ? message.split(': ')[1] : message}</span>
                    </div>
                )}

                {/* Bloco de Seleção de Modo / Scanner */}
                {inputMode !== 'results' && (
                    <div className="bg-white p-5 rounded-xl shadow-lg space-y-4">
                        <div className="flex justify-center gap-4 mb-4">
                            <button 
                                onClick={() => setInputMode('camera')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${inputMode === 'camera' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                <Camera size={18} className="inline mr-1" /> Câmera
                            </button>
                            <button 
                                onClick={() => setInputMode('manual')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${inputMode === 'manual' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                <List size={18} className="inline mr-1" /> Manual
                            </button>
                        </div>
                        
                        {/* MODO CÂMERA */}
                        {inputMode === 'camera' && (
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                <p className="text-center text-gray-600 mb-4 text-sm">Aponte a câmera para o QR Code.</p>
                                <QRCodeScanner 
                                    onScanSuccess={handleScanSuccess} 
                                    onScanError={(error) => console.warn(`Scan error: ${error}`)}
                                />
                            </div>
                        )}
                        
                        {/* MODO MANUAL */}
                        {inputMode === 'manual' && (
                            <form onSubmit={handleManualSubmit} className="space-y-3">
                                <div>
                                    <label htmlFor="manual-qr" className="block text-sm font-medium text-gray-700">
                                        Inserir ID do QR Code:
                                    </label>
                                    <input
                                        id="manual-qr"
                                        type="number"
                                        min="1"
                                        max="300"
                                        value={qrCodeId}
                                        onChange={(e) => setQrCodeId(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-lg"
                                        placeholder="Ex: 42"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg shadow-md font-semibold disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Buscando...' : 'Carregar Dados'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
                
                {/* Bloco de Confirmação e Atendimento */}
                {inputMode === 'results' && group && (
                    <div className="p-6 bg-green-50 rounded-xl shadow-lg border-l-4 border-green-500">
                        <h2 className="text-xl font-bold mb-4">Atendimento QR: {qrCodeId}</h2>
                        
                        {/* Lista dos Membros do Grupo */}
                        <h3 className="font-semibold text-gray-700 mb-2">Grupo Familiar:</h3>
                        <ul className="space-y-2 mb-6 text-sm">
                            {group.map((assistedItem) => (
                                <li key={assistedItem.id} className={`p-2 rounded-md ${assistedItem.responsible === null ? 'bg-green-100 font-semibold' : 'bg-gray-100'}`}>
                                    {assistedItem.person.nome}
                                    <span className={`ml-2 text-xs ${assistedItem.responsible === null ? 'text-green-800' : 'text-indigo-600'}`}>
                                        ({assistedItem.responsible === null ? 'Responsável Principal' : 'Criança'})
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Botão de Registro de Serviço */}
                        <p className="text-sm text-gray-700 mb-4">
                            O serviço **{serviceName}** será registrado para o grupo.
                        </p>
                        
                        <button
                            onClick={handleRegisterService}
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-base shadow-md"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : `FINALIZAR ATENDIMENTO`}
                        </button>

                        <button
                            onClick={handleNewScan}
                            className="w-full mt-2 py-2 text-gray-600 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-100 transition shadow-sm text-sm"
                        >
                            Novo Scan / ID
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ServicePage;