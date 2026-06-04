import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/auth/login`, { email, senha });
  }

  cadastrar(usuario: Omit<Usuario, 'id'>): Observable<string> {
    return this.http.post(`${this.api}/usuarios`, usuario, {
      responseType: 'text'
    });
  }

  salvarSessao(usuario: Usuario): void {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
  }

  getSessao(): Usuario | null {
    const dados = localStorage.getItem('usuarioLogado');
    return dados ? (JSON.parse(dados) as Usuario) : null;
  }

  isLogado(): boolean {
    return !!this.getSessao();
  }

  logout(): void {
    localStorage.removeItem('usuarioLogado');
  }
}