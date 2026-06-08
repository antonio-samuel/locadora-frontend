import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../core/services/auth.service';
import { LocacaoService } from '../core/services/locacao.service';
import { VeiculoService } from '../core/services/veiculo.services';
import { LocacaoDetalhe } from '../core/models/locacao.model';
import { Veiculo } from '../core/models/veiculo.model';
import { Usuario } from '../core/models/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PagamentoService } from '../core/services/pagamento.service';

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
  filtroStatus: string = 'TODAS';

  // Simulação
  simulacao: { visivel: boolean; valor: number; multa: number; total: number; data: string } = {
    visivel: false, valor: 0, multa: 0, total: 0, data: ''
  };
  simulacaoLocacao: LocacaoDetalhe | null = null;
  modalSimulacaoVisivel = false;
  dataSimulacaoModal = '';
  // Pagamento
modalPagamentoVisivel = false;
pagamentoLocacaoId: number | null = null;
pagamentoValor: number = 0;
metodoPagamentoSelecionado = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private locacaoService: LocacaoService,
    private veiculoService: VeiculoService,
    private router: Router,
    private pagamentoService: PagamentoService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      veiculoId:             ['', Validators.required],
      dataEmprestimo:        ['', Validators.required],
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

  // ── Getters ──────────────────────────────────────────────────────────────

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

  // ── Ações de Locação ──────────────────────────────────────────────────────

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

  async cancelar(id: number): Promise<void> {
    if (!confirm('Tem certeza que deseja cancelar esta locação?\nEsta ação não pode ser desfeita.')) return;
    try {
      await firstValueFrom(this.locacaoService.cancelar(id));
      await this.carregarDados();
    } catch {
      alert('❌ Erro ao cancelar locação.');
    }
  }

  // ── Simulação de Devolução ────────────────────────────────────────────────

  simularDevolucao(locacao: LocacaoDetalhe): void {
    this.simulacaoLocacao = locacao;
    this.simulacao = { visivel: false, valor: 0, multa: 0, total: 0, data: '' };
    this.modalSimulacaoVisivel = true;
  }

  confirmarSimulacao(): void {
  if (!this.dataSimulacaoModal || !this.simulacaoLocacao) return;

  const dataEmprestimo = new Date(
    this.simulacaoLocacao.dataEmprestimo.substring(0, 10) + 'T12:00:00'
  );
  const dataPrevista = new Date(
    this.simulacaoLocacao.dataDevolucaoPrevista.substring(0, 10) + 'T12:00:00'
  );
  const dataReal = new Date(this.dataSimulacaoModal + 'T12:00:00');

  const valorDiaria = Number(this.simulacaoLocacao.veiculo.valorDiaria);

  const diffAtraso  = dataReal.getTime() - dataPrevista.getTime();
  const diasAtraso  = Math.floor(diffAtraso / (1000 * 60 * 60 * 24));
  const comAtraso   = diasAtraso > 0;

  const diffUsados  = dataReal.getTime() - dataEmprestimo.getTime();
  const diasUsados  = Math.max(1, Math.floor(diffUsados / (1000 * 60 * 60 * 24)));
  const antecipada  = dataReal < dataPrevista;

  let valorBase: number;
  let multa = 0;

  if (antecipada) {
    // Recalcula pelo dias usados
    valorBase = diasUsados * valorDiaria;
  } else {
    valorBase = Number(this.simulacaoLocacao.valorTotal);
    if (comAtraso) {
      multa = diasAtraso * valorDiaria * 0.02;
    }
  }

  const total = valorBase + multa;

  this.simulacao = {
    visivel: true,
    valor:   valorBase,
    multa,
    total,
    data:    this.dataSimulacaoModal
  };

  this.modalSimulacaoVisivel = false;
  this.dataSimulacaoModal = '';
}

  fecharModalSimulacao(): void {
    this.modalSimulacaoVisivel = false;
    this.dataSimulacaoModal = '';
  }

  fecharSimulacao(): void {
    this.simulacao = { visivel: false, valor: 0, multa: 0, total: 0, data: '' };
    this.simulacaoLocacao = null;
  }

  abrirModalPagamento(locacao: LocacaoDetalhe): void {
  this.pagamentoLocacaoId = locacao.id!;
  this.pagamentoValor = Number(locacao.valorTotal);
  this.metodoPagamentoSelecionado = '';
  this.modalPagamentoVisivel = true;
}

fecharModalPagamento(): void {
  this.modalPagamentoVisivel = false;
  this.pagamentoLocacaoId = null;
  this.metodoPagamentoSelecionado = '';
}

async confirmarPagamento(): Promise<void> {
  if (!this.metodoPagamentoSelecionado || !this.pagamentoLocacaoId) return;
  try {
    await firstValueFrom(
      this.pagamentoService.processar(
        this.pagamentoLocacaoId,
        this.metodoPagamentoSelecionado
      )
    );
    this.fecharModalPagamento();
    await this.carregarDados();
  } catch {
    alert('❌ Erro ao processar pagamento. Tente novamente.');
  }
}

  // ── Utilitários ───────────────────────────────────────────────────────────

 formatarData(data: string): string {
  if (!data) return '—';
  // Adiciona T12:00:00 se for uma data simples (AAAA-MM-DD)
  const dataAjustada = data.length === 10 ? `${data}T12:00:00` : data;
  return new Date(dataAjustada).toLocaleDateString('pt-BR');
}
  formatarValor(valor: number): string {
    return valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '—';
  }

 badgeStatus(status: string): string {
  switch (status) {
    case 'ATIVA':                return 'badge bg-primary';
    case 'AGUARDANDO_PAGAMENTO': return 'badge bg-warning text-dark';
    case 'CONCLUIDA_NO_PRAZO':   return 'badge bg-success';
    case 'CONCLUIDA_COM_ATRASO': return 'badge bg-danger';
    case 'CANCELADA':            return 'badge bg-secondary';
    default:                     return 'badge bg-secondary';
  }
}

labelStatus(status: string): string {
  switch (status) {
    case 'ATIVA':                return 'Ativa';
    case 'AGUARDANDO_PAGAMENTO': return 'Aguardando Pagamento';
    case 'CONCLUIDA_NO_PRAZO':   return 'Concluída no Prazo';
    case 'CONCLUIDA_COM_ATRASO': return 'Concluída com Atraso';
    case 'CANCELADA':            return 'Cancelada';
    default:                     return status;
  }
}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/catalogo']);
  }
}