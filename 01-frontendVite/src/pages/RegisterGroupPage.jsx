import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// A URL base está configurada no App.jsx para simplificar

function RegisterGroupPage({ user }) {
    const [qrCodeId, setQrCodeId] = useState('');
    const [responsibleName, setResponsibleName] = useState('');
    const [responsiblePhone, setResponsiblePhone] = useState('');
    const [minorNames, setMinorNames] = useState(['']); // Array para crianças
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Adiciona um novo campo de criança
    const addMinorField = () => {
        setMinorNames([...minorNames, '']);
    };

    // Remove um campo de criança
    const removeMinorField = (index) => {
        const list = [...minorNames];
        list.splice(index, 1);
        setMinorNames(list);
    };

    // Atualiza o nome da criança em um índice específico
    const handleMinorNameChange = (e, index) => {
        const list = [...minorNames];
        list[index] = e.target.value;
        setMinorNames(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        // O backend espera um JSON com estas chaves
        const data = {
            qrCodeId: parseInt(qrCodeId),
            responsibleName,
            responsiblePhone: responsiblePhone.replace(/\D/g, ''),
            // Filtra strings vazias da lista de crianças
            minorNames: minorNames.filter(name => name.trim() !== '') 
        };

        try {
            const response = await axios.post(`/assisted/register-group`, data);
            setMessage(`Sucesso: ${response.data}`);
            
            // Limpa o formulário após o sucesso
            setQrCodeId('');
            setResponsibleName('');
            setResponsiblePhone('');
            setMinorNames(['']);
            
        } catch (err) {
            const msg = err.response?.data || 'Erro ao registrar grupo. Tente novamente.';
            setMessage(`Erro: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-300 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-700">Registro de Grupo Familiar</h1>
                <button 
                    onClick={() => navigate('/')} 
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                    Voltar ao Dashboard
                </button>
            </header>
            
            <form onSubmit={handleSubmit} className="mt-6 max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
                <p className="text-gray-500 text-sm">
                    Preencha os dados do responsável e associe o QR Code para registro na base.
                </p>

                {/* Mensagens de Sucesso/Erro */}
                {message && (
                    <div className={`p-3 rounded-lg text-sm ${message.startsWith('Sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.split(': ')[1]}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Campo QR Code ID */}
                    <label className="block text-sm font-medium text-gray-700">ID do QR Code (1-300)</label>
                    <input 
                        type="number"
                        min="1"
                        max="300"
                        value={qrCodeId}
                        onChange={(e) => setQrCodeId(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />

                    {/* Campo Nome do Responsável */}
                    <label className="block text-sm font-medium text-gray-700">Nome Completo do Responsável</label>
                    <input 
                        type="text"
                        value={responsibleName}
                        onChange={(e) => setResponsibleName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />

                    {/* Campo Telefone do Responsável */}
                    <label className="block text-sm font-medium text-gray-700">Telefone do Responsável</label>
                    <input 
                        type="tel"
                        value={responsiblePhone}
                        onChange={(e) => setResponsiblePhone(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Campos Crianças */}
                <h3 className="text-lg font-semibold border-t pt-4">Crianças/Menores de Idade (Opcional)</h3>
                {minorNames.map((minorName, index) => (
                    <div key={index} className="flex space-x-2 items-end">
                        <div className="flex-grow">
                            <label className="block text-xs font-medium text-gray-500">Nome da Criança {index + 1}</label>
                            <input
                                type="text"
                                value={minorName}
                                onChange={(e) => handleMinorNameChange(e, index)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Permite remover apenas se houver mais de uma linha */}
                        {minorNames.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeMinorField(index)}
                                className="p-2 text-red-500 hover:text-red-700 transition"
                            >
                                X
                            </button>
                        )}
                    </div>
                ))}
                
                <button 
                    type="button" 
                    onClick={addMinorField} 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    + Adicionar Criança
                </button>
                
                {/* Botão de Submissão */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 transition"
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrar Grupo e QR Code'}
                </button>
            </form>
        </div>
    );
}

export default RegisterGroupPage;
