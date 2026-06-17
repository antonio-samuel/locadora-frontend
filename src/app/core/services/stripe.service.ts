import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  criarSessao(locacaoId: number): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      `${this.api}/stripe/criar/${locacaoId}`, {}
    );
  }
}