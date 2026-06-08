import { LocacaoDetalhe } from './locacao.model';

export interface Pagamento {
  id?: number;
  locacao: { id: number };
  metodoPagamento: string;
  statusPagamento: string;
  valorPago: number;
  dataPagamento?: string;
}