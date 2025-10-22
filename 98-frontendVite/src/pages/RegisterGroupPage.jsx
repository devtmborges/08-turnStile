import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Definição do formato inicial para uma criança/menor
const initialMinorState = {
    nome: '',
    dataNascimento: '',
    qrCodeId: '',
};

function RegisterGroupPage({ user }) {
    const navigate = useNavigate();
    
    // Estados para o Responsável
    const [responsibleData, setResponsibleData] = useState({
        qrCodeId: '',
        responsibleName: '',
        responsibleBirthDate: '', // Novo campo
        responsiblePhone: '',
    });

    // Estado para as Crianças (começa com uma linha vazia)
    const [minors, setMinors] = useState([initialMinorState]);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Manipula a mudança de dados do Responsável
    const handleResponsibleChange = (e) => {
        const { name, value } = e.target;
        setResponsibleData(prev => ({ ...prev, [name]: value }));
    };

    // Manipula a mudança de dados das Crianças
    const handleMinorChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...minors];
        list[index] = { ...list[index], [name]: value };
        setMinors(list);
    };

    // Adiciona um novo campo de criança
    const addMinorField = () => {
        setMinors([...minors, initialMinorState]);
    };

    // Remove um campo de criança
    const removeMinorField = (index) => {
        const list = [...minors];
        list.splice(index, 1);
        setMinors(list.length > 0 ? list : [initialMinorState]); // Garante pelo menos um campo se estiver vazio
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        // Limpa crianças que não tiveram o nome preenchido (são linhas vazias)
        const validMinors = minors.filter(m => m.nome.trim() !== '');

        // Formato da requisição para o AssistedController.java
        const data = {
            qrCodeId: parseInt(responsibleData.qrCodeId),
            responsibleName: responsibleData.responsibleName,
            responsiblePhone: responsibleData.responsiblePhone.replace(/\D/g, ''),
            responsibleBirthDate: responsibleData.responsibleBirthDate,
            
            // Mapeia os dados das crianças para o formato MinorRegistration
            minors: validMinors.map(m => ({
                ...m,
                qrCodeId: m.qrCodeId ? parseInt(m.qrCodeId) : null, // Manda como int ou null
            }))
        };

        try {
            // A URL base está configurada no App.jsx
            const response = await axios.post(`/assisted/register-group`, data);
            setMessage(`Sucesso: ${response.data}`);
            
            // Limpa o formulário após o sucesso
            setResponsibleData({
                qrCodeId: '',
                responsibleName: '',
                responsibleBirthDate: '',
                responsiblePhone: '',
            });
            setMinors([initialMinorState]);
            
        } catch (err) {
            const msg = err.response?.data || 'Erro de conexão ou validação no backend.';
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
                    Preencha os dados do responsável (Adulto +14) e associe o QR Code principal.
                </p>

                {/* Mensagens de Sucesso/Erro */}
                {message && (
                    <div className={`p-3 rounded-lg text-sm ${message.startsWith('Sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.split(': ')[1]}
                    </div>
                )}

                {/* DADOS DO RESPONSÁVEL */}
                <div className="space-y-4 border p-4 rounded-lg bg-blue-50">
                    <h3 className="font-bold text-gray-800">Dados do Responsável</h3>
                    
                    {/* QR Code ID (Responsável) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">QR Code Principal (1-300)</label>
                        <input 
                            type="number"
                            name="qrCodeId"
                            min="1"
                            max="300"
                            value={responsibleData.qrCodeId}
                            onChange={handleResponsibleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    {/* Nome do Responsável */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input 
                            type="text"
                            name="responsibleName"
                            value={responsibleData.responsibleName}
                            onChange={handleResponsibleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Data de Nascimento (Responsável) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                        <input 
                            type="date"
                            name="responsibleBirthDate"
                            value={responsibleData.responsibleBirthDate}
                            onChange={handleResponsibleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Telefone do Responsável */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Telefone de Contato</label>
                        <input 
                            type="tel"
                            name="responsiblePhone"
                            value={responsibleData.responsiblePhone}
                            onChange={handleResponsibleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                {/* DADOS DAS CRIANÇAS */}
                <h3 className="text-lg font-semibold border-t pt-4">Crianças/Menores de Idade (Cada uma com QR próprio)</h3>
                
                {minors.map((minor, index) => (
                    <div key={index} className="space-y-3 p-3 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm text-gray-700">Criança #{index + 1}</h4>
                            {minors.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMinorField(index)}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    Remover
                                </button>
                            )}
                        </div>

                        {/* Nome da Criança */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={minor.nome}
                                onChange={(e) => handleMinorChange(index, e)}
                                required={minor.nome !== ''} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Data de Nascimento (Criança) */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Data de Nascimento</label>
                            <input
                                type="date"
                                name="dataNascimento"
                                value={minor.dataNascimento}
                                onChange={(e) => handleMinorChange(index, e)}
                                required={minor.nome !== ''}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* QR Code Individual (Criança) */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500">QR Code Individual (1-300)</label>
                            <input
                                type="number"
                                name="qrCodeId"
                                min="1"
                                max="300"
                                value={minor.qrCodeId}
                                onChange={(e) => handleMinorChange(index, e)}
                                required={minor.nome !== ''}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
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
                    {loading ? 'Registrando...' : 'Registrar Grupo e QR Codes'}
                </button>
            </form>
        </div>
    );
}

export default RegisterGroupPage;