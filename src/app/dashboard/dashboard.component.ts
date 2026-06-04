import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../core/services/auth.service';
import { LocacaoService } from '../core/services/locacao.service';
import { VeiculoService } from '../core/services/veiculo.services';
import { LocacaoDetalhe } from '../core/models/locacao.model';
import { Veiculo } from '../core/models/veiculo.model';
import { Usuario } from '../core/models/usuario.model';
import {ActivatedRoute ,Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  usuarioLogado: Usuario | null = null;
  locacoes: LocacaoDetalhe[] = [];
  veiculos: Veiculo[] = [];
  carregando = false;
  form: FormGroup;

  // Filtro de status
  filtroStatus: string = 'TODAS';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private locacaoService: LocacaoService,
    private veiculoService: VeiculoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      veiculoId:            ['', Validators.required],
      dataEmprestimo:       ['', Validators.required],
      dataDevolucaoPrevista: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  this.usuarioLogado = this.authService.getSessao();
  if (!this.usuarioLogado) {
    this.router.navigate(['/auth/login']);
    return;
  }
  this.carregarDados().then(() => {
    const veiculoId = this.route.snapshot.queryParamMap.get('veiculoId');
    if (veiculoId) {
      this.form.patchValue({ veiculoId });
    }
  });
}
 async carregarDados(): Promise<void> {
  try {
    const isAdmin = this.usuarioLogado?.perfil === 'ADMIN';

    const [locacoes, veiculos] = await Promise.all([
      isAdmin
        ? firstValueFrom(this.locacaoService.listar())
        : firstValueFrom(this.locacaoService.listarPorUsuario(this.usuarioLogado!.id!)),
      firstValueFrom(this.veiculoService.listarDisponiveis())
    ]);

    this.locacoes = locacoes;
    this.veiculos = veiculos;
  } catch {
    alert('❌ Erro ao carregar dados. Verifique se o backend está ativo.');
  }
}

 get locacoesFiltradas(): LocacaoDetalhe[] {
    if (this.filtroStatus === 'TODAS') return this.locacoes;
    return this.locacoes.filter(l => l.status === this.filtroStatus);
  }

  get totalAtivas(): number {
    return this.locacoes.filter(l => l.status === 'ATIVA').length;
  }

  get totalConcluidas(): number {
    return this.locacoes.filter(l =>
      l.status === 'CONCLUIDA_NO_PRAZO' || l.status === 'CONCLUIDA_COM_ATRASO'
    ).length;
  }

  get veiculosDisponiveis(): Veiculo[] {
    return this.veiculos.filter(v => v.disponivel);
  }
  async abrirLocacao(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.usuarioLogado) return;

    this.carregando = true;
    const { veiculoId, dataEmprestimo, dataDevolucaoPrevista } = this.form.value;

    const payload = {
      dataEmprestimo:        `${dataEmprestimo}T10:00:00`,
      dataDevolucaoPrevista: `${dataDevolucaoPrevista}T10:00:00`,
      status:                'ATIVA' as const,
      usuario:               { id: this.usuarioLogado.id! },
      veiculo:               { id: Number(veiculoId) }
    };

    try {
      await firstValueFrom(this.locacaoService.abrir(payload));
      this.form.reset();
      await this.carregarDados();
    } catch (err: any) {
      const msg = typeof err.error === 'string' ? err.error : '';
      if (msg.includes('já está alugado')) {
        alert('❌ Este veículo já está alugado no momento.');
      } else {
        alert('❌ Erro ao abrir locação. Tente novamente.');
      }
    } finally {
      this.carregando = false;
    }
  }

  async finalizar(id: number): Promise<void> {
    if (!confirm('Confirmar devolução do veículo?')) return;
    try {
      await firstValueFrom(this.locacaoService.finalizar(id));
      await this.carregarDados();
    } catch {
      alert('❌ Erro ao finalizar locação.');
    }
  }

  async simularAtraso(locacao: LocacaoDetalhe): Promise<void> {
  const dataPrevista = new Date(locacao.dataDevolucaoPrevista)
    .toISOString().slice(0, 10);

  const dataEscolhida = prompt(
    `Digite a data de devolução real (formato AAAA-MM-DD):\n` +
    `Data prevista: ${this.formatarData(locacao.dataDevolucaoPrevista)}\n` +
    `(Para gerar multa, escolha uma data posterior à prevista)`
  );

  if (!dataEscolhida) return;

  // Valida o formato básico da data
  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(dataEscolhida)) {
    alert('❌ Formato inválido. Use o formato AAAA-MM-DD.\nExemplo: 2026-06-20');
    return;
  }

  const dataISO = `${dataEscolhida}T10:00:00`;
  const dataFormatada = new Date(dataEscolhida).toLocaleDateString('pt-BR');
  const comAtraso = new Date(dataEscolhida) > new Date(dataPrevista);

  if (!confirm(
    `Confirmar devolução em ${dataFormatada}?\n` +
    `${comAtraso ? '⚠️ Esta data gera multa de 20%.' : '✅ Dentro do prazo, sem multa.'}`
  )) return;

  try {
    await firstValueFrom(this.locacaoService.simularAtraso(locacao.id!, dataISO));
    await this.carregarDados();
  } catch {
    alert('❌ Erro ao registrar devolução.');
  }
}
// Resultado da simulação
simulacao: { visivel: boolean; valor: number; multa: number; total: number; data: string } = {
  visivel: false, valor: 0, multa: 0, total: 0, data: ''
};
simulacaoLocacao: LocacaoDetalhe | null = null;

simularDevolucao(locacao: LocacaoDetalhe): void {
  const dataEscolhida = prompt(
    `Simulação de Devolução\n` +
    `Data prevista: ${this.formatarData(locacao.dataDevolucaoPrevista)}\n\n` +
    `Digite a data de devolução (formato AAAA-MM-DD):`
  );

  if (!dataEscolhida) return;

  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(dataEscolhida)) {
    alert('❌ Formato inválido. Use AAAA-MM-DD.\nExemplo: 2026-06-20');
    return;
  }

  const dataPrevista = new Date(locacao.dataDevolucaoPrevista);
  const dataReal     = new Date(dataEscolhida);
  const comAtraso    = dataReal > dataPrevista;

  const valorBase = locacao.valorTotal;
  const multa     = comAtraso ? valorBase * 0.20 : 0;
  const total     = valorBase + multa;

  this.simulacaoLocacao = locacao;
  this.simulacao = {
    visivel: true,
    valor:   valorBase,
    multa,
    total,
    data:    dataEscolhida
  };
}

fecharSimulacao(): void {
  this.simulacao = { visivel: false, valor: 0, multa: 0, total: 0, data: '' };
  this.simulacaoLocacao = null;
}

  formatarData(data: string): string {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarValor(valor: number): string {
    return valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '—';
  }

 badgeStatus(status: string): string {
  switch (status) {
    case 'ATIVA':                return 'badge bg-primary';
    case 'CONCLUIDA_NO_PRAZO':   return 'badge bg-success';
    case 'CONCLUIDA_COM_ATRASO': return 'badge bg-danger';
    case 'CANCELADA':            return 'badge bg-warning text-dark';
    default:                     return 'badge bg-secondary';
  }
}

labelStatus(status: string): string {
  switch (status) {
    case 'ATIVA':                return 'Ativa';
    case 'CONCLUIDA_NO_PRAZO':   return 'Concluída no Prazo';
    case 'CONCLUIDA_COM_ATRASO': return 'Concluída com Atraso';
    case 'CANCELADA':            return 'Cancelada';
    default:                     return status;
  }
}

  async cancelar(id: number): Promise<void> {
  if (!confirm('Tem certeza que deseja cancelar esta locação?\nEsta ação não pode ser desfeita.')) return;
  try {
    await firstValueFrom(this.locacaoService.cancelar(id));
    await this.carregarDados();
  } catch {
    alert('❌ Erro ao cancelar locação.');
  }
}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}