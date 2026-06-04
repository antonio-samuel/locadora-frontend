import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { VeiculoService } from '../core/services/veiculo.services';
import { AuthService } from '../core/services/auth.service';
import { Veiculo } from '../core/models/veiculo.model';
import { getFotoVeiculo } from '../core/utils/veiculo-foto.util';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent implements OnInit {

  veiculos: Veiculo[] = [];
  veiculosFiltrados: Veiculo[] = [];
  carregando = true;

  // Filtros
  termoBusca = '';
  categoriaSelecionada = 'TODAS';
  ordenacao = 'MENOR_PRECO';
  apenasDisponiveis = true;

  categorias = [
    { valor: 'TODAS',   label: 'Todas as Categorias' },
    { valor: 'SEDAN',   label: 'Sedan' },
    { valor: 'SUV',     label: 'SUV' },
    { valor: 'HATCH',   label: 'Hatch' },
    { valor: 'PICKUP',  label: 'Pickup' }
  ];

  constructor(
  private veiculoService: VeiculoService,
  public authService: AuthService,
  private router: Router
) {}

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  async carregarVeiculos(): Promise<void> {
    try {
      this.veiculos = await firstValueFrom(this.veiculoService.listarDisponiveis());
      this.aplicarFiltros();
    } catch {
      alert('❌ Erro ao carregar veículos.');
    } finally {
      this.carregando = false;
    }
  }

  aplicarFiltros(): void {
    let resultado = [...this.veiculos];

    // Filtro de disponibilidade
    if (this.apenasDisponiveis) {
      resultado = resultado.filter(v => v.disponivel);
    }

    // Filtro de busca por texto
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(v =>
        v.marca.toLowerCase().includes(termo) ||
        v.modelo.toLowerCase().includes(termo) ||
        v.placa.toLowerCase().includes(termo) ||
        v.cor.toLowerCase().includes(termo)
      );
    }

    // Filtro de categoria baseado no modelo
    if (this.categoriaSelecionada !== 'TODAS') {
      const mapaCategoria: Record<string, string[]> = {
        'SEDAN':  ['corolla', 'civic', 'onix plus'],
        'SUV':    ['renegade', 't-cross', 'territory'],
        'HATCH':  ['polo', 'hb20', 'onix', 'kwid'],
        'PICKUP': ['hilux', 's10']
      };
      const modelos = mapaCategoria[this.categoriaSelecionada] ?? [];
      resultado = resultado.filter(v =>
        modelos.some(m => v.modelo.toLowerCase().includes(m))
      );
    }

    // Ordenação
    switch (this.ordenacao) {
      case 'MENOR_PRECO':
        resultado.sort((a, b) => a.valorDiaria - b.valorDiaria);
        break;
      case 'MAIOR_PRECO':
        resultado.sort((a, b) => b.valorDiaria - a.valorDiaria);
        break;
      case 'MAIS_NOVO':
        resultado.sort((a, b) => b.ano - a.ano);
        break;
    }

    this.veiculosFiltrados = resultado;
  }

  getFoto(marca: string, modelo: string): string {
    return getFotoVeiculo(marca, modelo);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  alugar(veiculo: Veiculo): void {
    if (!this.authService.isLogado()) {
      if (confirm('Você precisa estar logado para alugar um veículo.\nDeseja fazer login agora?')) {
        this.router.navigate(['/auth/login']);
      }
      return;
    }
    this.router.navigate(['/dashboard'], {
      queryParams: { veiculoId: veiculo.id }
    });
  }
}