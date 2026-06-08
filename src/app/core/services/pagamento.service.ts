import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Pagamento } from '../models/pagamento.model';

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  processar(locacaoId: number, metodoPagamento: string): Observable<Pagamento> {
    return this.http.post<Pagamento>(
      `${this.api}/pagamentos/processar/${locacaoId}`,
      { metodoPagamento }
    );
  }
}