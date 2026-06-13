
import { Usuario } from './usuario.model'; 

export interface Notificacao {
  id: number;
  mensagem: string;
  dataEnvio: string; // O Spring enviará um ISO 8601 (ex: "2026-06-13T08:00:00")
  lida: boolean;
  usuario: Usuario; 
}