
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DiariaData } from '../types';

export const generateDiariaPDF = (data: DiariaData) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('REQUISIÇÃO E RELATÓRIO DE DIÁRIAS', 105, y, { align: 'center' });
  
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('DOCUMENTO OFICIAL DE PRESTAÇÃO DE CONTAS', 105, y, { align: 'center' });

  y += 15;
  // 1. Dados do Servidor
  doc.setFont('helvetica', 'bold');
  doc.text('1. DADOS DO SERVIDOR', margin, y);
  y += 5;
  doc.line(margin, y, 190, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  const servidorInfo = [
    [`Nome: ${data.servidor.nome}`, `Matrícula: ${data.servidor.matricula}`],
    [`Cargo: ${data.servidor.cargo}`, `Setor: ${data.servidor.setor}`],
    [`CPF: ${data.servidor.cpf}`, `Banco: ${data.servidor.banco} / Ag: ${data.servidor.agencia} / CC: ${data.servidor.conta}`],
  ];

  (doc as any).autoTable({
    startY: y,
    head: [],
    body: servidorInfo,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1 },
    margin: { left: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // 2. Dados da Viagem
  doc.setFont('helvetica', 'bold');
  doc.text('2. DETALHES DA VIAGEM', margin, y);
  y += 5;
  doc.line(margin, y, 190, y);
  y += 7;

  const viagemInfo = [
    ['Origem:', data.viagem.origem, 'Destino:', `${data.viagem.destino} (${data.viagem.zona})`],
    ['Saída:', `${data.viagem.dataSaida} às ${data.viagem.horaSaida}`, 'Retorno:', `${data.viagem.dataRetorno} às ${data.viagem.horaRetorno}`],
    ['Veículo:', data.viagem.veiculo, 'Placa:', data.viagem.placa || 'N/A'],
  ];

  (doc as any).autoTable({
    startY: y,
    body: viagemInfo,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', width: 30 }, 2: { fontStyle: 'bold', width: 30 } },
    margin: { left: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // 3. Objetivo
  doc.setFont('helvetica', 'bold');
  doc.text('3. OBJETIVO DA MISSÃO', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const splitObjetivo = doc.splitTextToSize(data.viagem.objetivo, 170);
  doc.text(splitObjetivo, margin, y + 5);
  y += splitObjetivo.length * 5 + 10;

  // 4. Relatório de Atividades
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('4. RELATÓRIO CIRCUNSTANCIADO DAS ATIVIDADES', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const splitRelatorio = doc.splitTextToSize(data.relatorio, 170);
  doc.text(splitRelatorio, margin, y + 5);
  y += splitRelatorio.length * 5 + 15;

  // 5. Financeiro
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('5. DEMONSTRATIVO FINANCEIRO', margin, y);
  y += 5;
  doc.line(margin, y, 190, y);
  y += 7;
  
  doc.text(`Valor Unitário: R$ ${data.financeiro.valorUnitario.toFixed(2)}`, margin, y);
  doc.text(`Qtd. Diárias: ${data.financeiro.quantidade}`, margin + 60, y);
  doc.text(`TOTAL A RECEBER: R$ ${data.financeiro.total.toFixed(2)}`, margin + 110, y);

  y += 40;
  // Assinaturas
  doc.line(margin, y, margin + 70, y);
  doc.line(120, y, 190, y);
  y += 5;
  doc.setFontSize(8);
  doc.text('ASSINATURA DO SERVIDOR', margin + 35, y, { align: 'center' });
  doc.text('ASSINATURA DA CHEFIA IMEDIATA', 155, y, { align: 'center' });

  doc.save(`Diaria_${data.servidor.nome.replace(/\s+/g, '_')}_${data.viagem.dataSaida.replace(/\//g, '-')}.pdf`);
};
