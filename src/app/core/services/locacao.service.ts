import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Locacao, LocacaoDetalhe } from '../models/locacao.model';

@Injectable({ providedIn: 'root' })
export class LocacaoService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}
  
  listarPorUsuario(usuarioId: number): Observable<LocacaoDetalhe[]> {
  return this.http.get<LocacaoDetalhe[]>(`${this.api}/locacoes/usuario/${usuarioId}`);
}

  listar(): Observable<LocacaoDetalhe[]> {
    return this.http.get<LocacaoDetalhe[]>(`${this.api}/locacoes`);
  }

  abrir(locacao: Locacao): Observable<LocacaoDetalhe> {
    return this.http.post<LocacaoDetalhe>(`${this.api}/locacoes`, locacao);
  }

  finalizar(id: number): Observable<LocacaoDetalhe> {
    return this.http.put<LocacaoDetalhe>(`${this.api}/locacoes/${id}/finalizar`, {});
  }

  simularAtraso(id: number, dataDevolucaoReal: string): Observable<LocacaoDetalhe> {
    return this.http.put<LocacaoDetalhe>(`${this.api}/locacoes/${id}`, {
      dataDevolucaoReal
    }
  );
    
  }

  cancelar(id: number): Observable<LocacaoDetalhe> {
  return this.http.put<LocacaoDetalhe>(`${this.api}/locacoes/${id}/cancelar`, {});
}
}