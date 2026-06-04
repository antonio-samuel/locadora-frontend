export interface Usuario {
  id?: number;
  nome: string;
  cpf: string;
  cnh: string;
  telefone: string;
  email: string;
  senha?: string;
  perfil?: 'CLIENTE' | 'ADMIN';
}