import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; // ← adicionar HttpHeaders e HttpErrorResponse
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  // Listar todos (admin)
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/${id}`);
  }

  // Cadastrar (igual ao AuthService, resposta plain text) – usado pelo admin
  cadastrar(dados: any): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.api, dados, { headers, responseType: 'text' });
  }

  // Atualizar (resposta JSON: Usuario) – usado pelo admin e perfil
  updateUsuario(id: number, dados: any): Observable<Usuario> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Usuario>(`${this.api}/${id}`, dados, { headers });
  }

  // Alias para manter compatibilidade com o PerfilComponent
  atualizar(id: number, dados: any): Observable<Usuario> {
    return this.updateUsuario(id, dados);
  }

  // Excluir (admin)
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}