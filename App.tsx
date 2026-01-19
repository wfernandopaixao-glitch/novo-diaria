
import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Download, Wand2, MapPin, User, Wallet, History, Send, Trash2 } from 'lucide-react';
import { DiariaData, initialData, ZoneType } from './types';
import { Input, TextArea, Select } from './components/Input';
import { improveReport } from './services/geminiService';
import { generateDiariaPDF } from './services/pdfService';

const App: React.FC = () => {
  const [data, setData] = useState<DiariaData>(() => {
    const saved = localStorage.getItem('diaria_form_data');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [isImproving, setIsImproving] = useState(false);
  const [history, setHistory] = useState<DiariaData[]>(() => {
    const saved = localStorage.getItem('diaria_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('diaria_form_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('diaria_history', JSON.stringify(history));
  }, [history]);

  const updateServidor = (field: keyof DiariaData['servidor'], value: string) => {
    setData(prev => ({ ...prev, servidor: { ...prev.servidor, [field]: value } }));
  };

  const updateViagem = (field: keyof DiariaData['viagem'], value: string | ZoneType) => {
    setData(prev => ({ ...prev, viagem: { ...prev.viagem, [field]: value } }));
  };

  const updateFinanceiro = (field: keyof DiariaData['financeiro'], value: number) => {
    setData(prev => {
      const newState = { ...prev, financeiro: { ...prev.financeiro, [field]: value } };
      newState.financeiro.total = newState.financeiro.valorUnitario * newState.financeiro.quantidade;
      return newState;
    });
  };

  const handleImproveReport = async () => {
    if (!data.relatorio || !data.viagem.objetivo) {
      alert("Preencha o objetivo e as notas do relatório primeiro.");
      return;
    }
    setIsImproving(true);
    const improved = await improveReport(data.relatorio, data.viagem.objetivo);
    setData(prev => ({ ...prev, relatorio: improved }));
    setIsImproving(false);
  };

  const handleDownloadPDF = () => {
    generateDiariaPDF(data);
    // Adicionar ao histórico se não estiver vazio
    if (data.servidor.nome && data.viagem.dataSaida) {
      setHistory(prev => [data, ...prev].slice(0, 10));
    }
  };

  const handleClear = () => {
    if (confirm("Deseja realmente limpar todos os campos?")) {
      setData(initialData);
    }
  };

  const loadFromHistory = (item: DiariaData) => {
    setData(item);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight">Sispaf <span className="font-light text-blue-100">| Diárias</span></h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-900 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> Limpar
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors text-sm font-bold shadow-md"
            >
              <Download className="w-4 h-4" /> Gerar PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Servidor */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-700">
              <User className="w-5 h-5" />
              <h2 className="text-lg font-bold">Identificação do Servidor</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nome Completo" value={data.servidor.nome} onChange={e => updateServidor('nome', e.target.value)} placeholder="Ex: João da Silva" />
              <Input label="Matrícula" value={data.servidor.matricula} onChange={e => updateServidor('matricula', e.target.value)} placeholder="000.000-0" />
              <Input label="Cargo" value={data.servidor.cargo} onChange={e => updateServidor('cargo', e.target.value)} placeholder="Ex: Motorista" />
              <Input label="Setor/Secretaria" value={data.servidor.setor} onChange={e => updateServidor('setor', e.target.value)} placeholder="Ex: Secretaria de Saúde" />
              <Input label="CPF" value={data.servidor.cpf} onChange={e => updateServidor('cpf', e.target.value)} placeholder="000.000.000-00" />
              <div className="grid grid-cols-3 gap-2">
                <Input label="Banco" value={data.servidor.banco} onChange={e => updateServidor('banco', e.target.value)} />
                <Input label="Agência" value={data.servidor.agencia} onChange={e => updateServidor('agencia', e.target.value)} />
                <Input label="Conta" value={data.servidor.conta} onChange={e => updateServidor('conta', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Section: Viagem */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-700">
              <MapPin className="w-5 h-5" />
              <h2 className="text-lg font-bold">Informações da Viagem</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Origem" value={data.viagem.origem} onChange={e => updateViagem('origem', e.target.value)} />
              <div className="flex gap-2 items-end">
                <Input label="Destino" value={data.viagem.destino} onChange={e => updateViagem('destino', e.target.value)} className="flex-grow" />
                <Select label="Zona" value={data.viagem.zona} onChange={e => updateViagem('zona', e.target.value as ZoneType)} className="w-32">
                  <option value={ZoneType.URBANA}>Urbana</option>
                  <option value={ZoneType.RURAL}>Rural</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Data Saída" type="date" value={data.viagem.dataSaida} onChange={e => updateViagem('dataSaida', e.target.value)} />
                <Input label="Hora Saída" type="time" value={data.viagem.horaSaida} onChange={e => updateViagem('horaSaida', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Data Retorno" type="date" value={data.viagem.dataRetorno} onChange={e => updateViagem('dataRetorno', e.target.value)} />
                <Input label="Hora Retorno" type="time" value={data.viagem.horaRetorno} onChange={e => updateViagem('horaRetorno', e.target.value)} />
              </div>
              <Input label="Veículo" value={data.viagem.veiculo} onChange={e => updateViagem('veiculo', e.target.value)} placeholder="Ex: Oficial / Próprio" />
              <Input label="Placa (se oficial)" value={data.viagem.placa} onChange={e => updateViagem('placa', e.target.value)} />
            </div>
            <div className="mt-4">
              <TextArea 
                label="Objetivo da Missão" 
                value={data.viagem.objetivo} 
                onChange={e => updateViagem('objetivo', e.target.value)} 
                placeholder="Descreva o propósito da viagem..."
              />
            </div>
          </section>

          {/* Section: Relatório */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-blue-700">
                <Send className="w-5 h-5" />
                <h2 className="text-lg font-bold">Relatório de Atividades</h2>
              </div>
              <button
                onClick={handleImproveReport}
                disabled={isImproving}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold border border-indigo-200"
              >
                {isImproving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-700 border-t-transparent"></div>
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                Melhorar com IA
              </button>
            </div>
            <TextArea 
              label="Relatório Circunstanciado" 
              value={data.relatorio} 
              onChange={e => setData(prev => ({ ...prev, relatorio: e.target.value }))} 
              placeholder="Descreva detalhadamente o que foi feito..."
              className="min-h-[200px]"
            />
            <p className="text-xs text-slate-500 mt-2">Dica: Escreva tópicos simples e use o botão "Melhorar com IA" para formatar o texto oficialmente.</p>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Section: Financeiro */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-700">
              <Wallet className="w-5 h-5" />
              <h2 className="text-lg font-bold">Financeiro</h2>
            </div>
            <div className="space-y-4">
              <Input 
                label="Valor da Diária (R$)" 
                type="number" 
                value={data.financeiro.valorUnitario} 
                onChange={e => updateFinanceiro('valorUnitario', parseFloat(e.target.value) || 0)} 
              />
              <Input 
                label="Quantidade" 
                type="number" 
                step="0.5" 
                value={data.financeiro.quantidade} 
                onChange={e => updateFinanceiro('quantidade', parseFloat(e.target.value) || 0)} 
              />
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">Total Previsto</p>
                <p className="text-3xl font-bold text-slate-900">R$ {data.financeiro.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </section>

          {/* Section: Histórico Recente */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-700">
              <History className="w-5 h-5" />
              <h2 className="text-lg font-bold">Recentes</h2>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Nenhuma diária gerada recentemente.</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.servidor.nome || 'Sem nome'}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-slate-500">{item.viagem.dataSaida}</span>
                      <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Carregar</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Guidelines */}
          <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Instruções
            </h3>
            <ul className="text-xs text-blue-700 space-y-2 list-disc pl-4">
              <li>Preencha todos os campos obrigatórios para o PDF.</li>
              <li>Use a zona <b>Rural</b> para trajetos fora do perímetro urbano.</li>
              <li>O relatório deve conter as ações realizadas cronologicamente.</li>
              <li>Após gerar o PDF, colete as assinaturas necessárias.</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;
