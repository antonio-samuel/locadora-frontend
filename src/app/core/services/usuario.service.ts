import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  atualizar(id: number, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.api}/usuarios/${id}`, usuario);
  }
}