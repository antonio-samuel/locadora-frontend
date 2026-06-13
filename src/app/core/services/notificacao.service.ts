// src/app/core/services/notificacao.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Notificacao } from '../models/notificacao.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private readonly API_URL = 'http://localhost:8081/notificacoes';

  constructor(private http: HttpClient) {}

  async buscarPorUsuario(usuarioId: number): Promise<Notificacao[]> {
    return firstValueFrom(
      this.http.get<Notificacao[]>(`${this.API_URL}/usuario/${usuarioId}`)
    );
  }

  async marcarComoLida(id: number): Promise<Notificacao> {
    // Removido o responseType: 'text'. Agora ele espera o JSON retornado pelo Controller.
    return firstValueFrom(
      this.http.put<Notificacao>(`${this.API_URL}/${id}/lida`, {})
    );
  }
}