
export enum ZoneType {
  URBANA = 'Urbana',
  RURAL = 'Rural'
}

export interface DiariaData {
  servidor: {
    nome: string;
    matricula: string;
    cargo: string;
    setor: string;
    cpf: string;
    banco: string;
    agencia: string;
    conta: string;
  };
  viagem: {
    origem: string;
    destino: string;
    zona: ZoneType;
    dataSaida: string;
    horaSaida: string;
    dataRetorno: string;
    horaRetorno: string;
    objetivo: string;
    veiculo: string;
    placa: string;
  };
  financeiro: {
    valorUnitario: number;
    quantidade: number;
    total: number;
  };
  relatorio: string;
}

export const initialData: DiariaData = {
  servidor: {
    nome: '',
    matricula: '',
    cargo: '',
    setor: '',
    cpf: '',
    banco: '',
    agencia: '',
    conta: ''
  },
  viagem: {
    origem: '',
    destino: '',
    zona: ZoneType.URBANA,
    dataSaida: '',
    horaSaida: '08:00',
    dataRetorno: '',
    horaRetorno: '18:00',
    objetivo: '',
    veiculo: 'Oficial',
    placa: ''
  },
  financeiro: {
    valorUnitario: 0,
    quantidade: 1,
    total: 0
  },
  relatorio: ''
};
