import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Veiculo } from '../models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarDisponiveis(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${this.api}/veiculos`);
  }
}