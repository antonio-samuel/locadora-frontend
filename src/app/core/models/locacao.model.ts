import { Veiculo } from './veiculo.model';
import { Usuario } from './usuario.model';

export interface Locacao {
  id?: number;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
 status: 'ATIVA' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDA_NO_PRAZO' | 'CONCLUIDA_COM_ATRASO' | 'CANCELADA';
  valorTotal?: number;
  valorMulta?: number;
  usuario: { id: number };
  veiculo: { id: number };
}

export interface LocacaoDetalhe {
  id: number;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
 status: 'ATIVA' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDA_NO_PRAZO' | 'CONCLUIDA_COM_ATRASO' | 'CANCELADA';
  valorTotal: number;
  valorMulta?: number;
  usuario: Usuario;
  veiculo: Veiculo;
}