import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VeiculoService } from '../../core/services/veiculo.services'; // ← corrigido
import { Veiculo } from '../../core/models/veiculo.model';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { getFotoVeiculo } from '../../core/utils/veiculo-foto.util';

const CATEGORIAS = ['HATCH', 'SUV', 'SEDAN', 'PICKUP']; // ← fora da classe

@Component({
  selector: 'app-admin-veiculos',
  templateUrl: './admin-veiculos.component.html',
})
export class AdminVeiculosComponent implements OnInit {
  veiculos: Veiculo[] = [];
  form: FormGroup;
  editando = false;
  veiculoSelecionado: Veiculo | null = null;
  modalAberto = false;
  fazendoUpload = false;
  categorias = CATEGORIAS; // ← agora enxerga a constante

  constructor(private veiculoService: VeiculoService, private fb: FormBuilder) {
    this.form = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
      cor: ['', Validators.required],
      ano: [null, [Validators.required, Validators.min(1900)]],
      valorDiaria: [null, [Validators.required, Validators.min(0)]],
      disponivel: [true],
      fotoUrl: [''],
      categoria: [''],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.carregarVeiculos();
  }

  async carregarVeiculos(): Promise<void> {
    try {
      this.veiculos = await firstValueFrom(this.veiculoService.getVeiculos());
    } catch (err) {
      console.error('Erro ao carregar veículos', err);
    }
  }

  abrirModal(veiculo?: Veiculo): void {
    this.editando = !!veiculo;
    this.veiculoSelecionado = veiculo ?? null;
    if (veiculo) {
      this.form.patchValue(veiculo);
    } else {
      this.form.reset({ disponivel: true });
    }
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.form.reset();
  }

  // Upload de imagem – apenas coloca a URL no campo
  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.fazendoUpload = true;
    try {
      const resposta = await firstValueFrom(this.veiculoService.uploadImagem(file));
      this.form.patchValue({ fotoUrl: resposta.url });
    } catch (err) {
      alert('Erro ao fazer upload da imagem.');
      console.error(err);
    } finally {
      this.fazendoUpload = false;
    }
  }

  async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = { ...this.form.value };
    delete dados.id;   // remove id se existir

    // Fallback para foto padrão do Unsplash se nenhuma imagem foi enviada
    if (!dados.fotoUrl) {
      dados.fotoUrl = getFotoVeiculo(dados.marca, dados.modelo);
    }

    console.log('Dados enviados:', dados);
    try {
      if (this.editando && this.veiculoSelecionado) {
        await firstValueFrom(this.veiculoService.updateVeiculo(this.veiculoSelecionado.id, dados));
      } else {
        await firstValueFrom(this.veiculoService.createVeiculo(dados));
      }
      this.fecharModal();
      await this.carregarVeiculos();
    } catch (error) {
      const mensagem = error instanceof HttpErrorResponse
        ? (typeof error.error === 'string' ? error.error : error.message)
        : 'Erro desconhecido';
      alert('Erro ao salvar veículo: ' + mensagem);
    }
  }

  async excluir(veiculo: Veiculo): Promise<void> {
    if (!confirm(`Deseja realmente excluir o veículo ${veiculo.modelo} (${veiculo.placa})?`)) return;
    try {
      await firstValueFrom(this.veiculoService.deleteVeiculo(veiculo.id));
      await this.carregarVeiculos();
    } catch (error) {
      const mensagem = error instanceof HttpErrorResponse
        ? (typeof error.error === 'string' ? error.error : error.message)
        : 'Erro desconhecido';
      alert('Erro ao excluir veículo: ' + mensagem);
    }
  }

  alternarDisponibilidade(veiculo: Veiculo): void {
    const atualizado = { ...veiculo, disponivel: !veiculo.disponivel };
    this.veiculoService.updateVeiculo(veiculo.id, atualizado).subscribe({
      next: () => this.carregarVeiculos(),
      error: (err: HttpErrorResponse) => {
        const msg = typeof err.error === 'string' ? err.error : err.message;
        alert('Erro ao alterar disponibilidade: ' + msg);
      },
    });
  }
}