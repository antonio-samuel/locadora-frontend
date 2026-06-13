import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Veiculo } from '../models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private api = `${environment.apiUrl}/veiculos`;

  constructor(private http: HttpClient) {}

  listarDisponiveis(): Observable<Veiculo[]> {
  return this.http.get<Veiculo[]>(`${this.api}/disponiveis`);
}
listarTodos(): Observable<Veiculo[]> {
  // Não precisa de barra no final, chama direto a URL base
  return this.http.get<Veiculo[]>(this.api);
}
  getVeiculos(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.api);
  }

  getVeiculoById(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.api}/${id}`);
  }

 createVeiculo(veiculo: Veiculo): Observable<Veiculo> {
  return this.http.post<Veiculo>(`${this.api}`, veiculo);
}

  updateVeiculo(id: number, veiculo: Partial<Veiculo>): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.api}/${id}`, veiculo);
  }

  deleteVeiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  createVeiculoMultipart(formData: FormData): Observable<Veiculo> {
  return this.http.post<Veiculo>(this.api, formData);
}
updateVeiculoMultipart(id: number, formData: FormData): Observable<Veiculo> {
  return this.http.put<Veiculo>(`${this.api}/${id}`, formData);
}
uploadImagem(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/api/upload`, formData);
}
}