// import React, { useState } from 'react';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCodeScanner from '../components/QRCodeScanner'; // Importa APENAS o que ServicePage precisa



// ... (O resto do código da função ServicePage)

const API_BASE_URL = 'http://localhost:8080/api';

function ServicePage({ user }) {
    const { serviceName } = useParams();
    const navigate = useNavigate();
    const [qrCodeId, setQrCodeId] = useState(null);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // --- AÇÃO 1: LEITURA DO QR CODE E BUSCA DO GRUPO ---
    const handleScanSuccess = async (decodedText) => {
        const id = parseInt(decodedText.trim());
        if (isNaN(id) || id < 1 || id > 300) {
            setMessage('Erro: QR Code inválido ou fora do intervalo (1-300).');
            return;
        }

        setMessage(`QR Code ${id} lido. Buscando grupo...`);
        setQrCodeId(id);
        
        try {
            // Chama o endpoint do backend para buscar o grupo familiar pelo QR Code
            const response = await axios.get(`${API_BASE_URL}/assisted/group/${id}`);
            setGroup(response.data);
            setMessage(`Grupo de ${response.data.length} pessoa(s) encontrado.`);
        } catch (err) {
            const msg = err.response?.data || 'Erro: QR Code não está registrado na base.';
            setMessage(`Erro: ${msg}`);
            setQrCodeId(null);
            setGroup(null);
        }
    };

    // --- AÇÃO 2: REGISTRO DO SERVIÇO CONCLUÍDO ---
    const handleRegisterService = async () => {
        if (!user.id || !qrCodeId) {
            setMessage('Erro: Falha de sessão ou QR Code não lido.');
            return;
        }

        setLoading(true);

        const data = {
            volunteerId: user.id,
            qrCodeId: qrCodeId,
            serviceName: serviceName,
        };

        try {
            // Chama o endpoint do backend para registrar o serviço
            const response = await axios.post(`${API_BASE_URL}/done-service/register`, data);
            
            // Sucesso: Limpa a tela para o próximo atendimento
            setQrCodeId(null);
            setGroup(null);
            setMessage(`Sucesso: ${response.data.split(': ')[1]}`);
            
        } catch (err) {
            const msg = err.response?.data || 'Erro ao registrar serviço. Tente novamente.';
            setMessage(`Erro no Registro: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div className="min-h-screen bg-white p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-bold text-green-700">Registrando: {serviceName}</h1>
                <button 
                    onClick={() => navigate('/')} 
                    className="text-sm text-indigo-600 hover:text-indigo-800"
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

                {/* Bloco de Leitura do QR Code */}
                {!group && (
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <p className="text-center text-gray-600 mb-4 font-semibold">Aponte a câmera para o QR Code do RESPONSÁVEL</p>
                        {/* Componente Scanner */}
                        <QRCodeScanner 
                            onScanSuccess={handleScanSuccess} 
                            onScanError={(error) => console.warn(`Scan error: ${error}`)}
                        />
                    </div>
                )}
                
                {/* Bloco de Confirmação e Atendimento */}
                {group && (
                    <div className="p-6 bg-green-50 rounded-xl shadow-lg border-l-4 border-green-500">
                        <h2 className="text-lg font-bold mb-4">QR Code: {qrCodeId} - Grupo Encontrado</h2>
                        
                        {/* Lista dos Membros do Grupo */}
                        <ul className="space-y-2 mb-6">
                            {group.map((assistedItem, index) => (
                                <li key={assistedItem.id} className={`p-2 rounded-md ${assistedItem.person.isMinor ? 'bg-gray-100' : 'bg-green-100 font-semibold'}`}>
                                    <span className="text-sm text-gray-500 mr-2">#{index + 1}</span>
                                    {assistedItem.person.nome}
                                    {assistedItem.person.isMinor ? ' (Criança)' : ' (Responsável)'}
                                    <span className="text-xs ml-2 text-indigo-500">
                                        {/* Exibe o telefone do responsável para referência rápida */}
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
                            onClick={handleRegisterService}
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
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