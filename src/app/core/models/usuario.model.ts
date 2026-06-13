export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  email: string;
  telefone: string;
  senha?: string; // opcional, não trafegar sempre
  perfil: 'CLIENTE' | 'ADMIN';
}