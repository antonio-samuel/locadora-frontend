import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  form: FormGroup;
  editando = false;
  usuarioSelecionado: Usuario | null = null;
  modalAberto = false;
  erroDuplicidade: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      cnh: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      senha: ['', [Validators.minLength(4)]], // opcional na edição
      perfil: ['CLIENTE', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.carregarUsuarios();
  }

  async carregarUsuarios(): Promise<void> {
    try {
      this.usuarios = await firstValueFrom(this.usuarioService.getUsuarios());
    } catch (err) {
      console.error('Erro ao carregar usuários', err);
    }
  }

  abrirModal(usuario?: Usuario): void {
    this.editando = !!usuario;
    this.usuarioSelecionado = usuario ?? null;
    this.erroDuplicidade = null;

    this.form.reset({ perfil: 'CLIENTE' }); // reset para valores padrão
    if (usuario) {
      this.form.patchValue({
        nome: usuario.nome,
        cpf: usuario.cpf,
        cnh: usuario.cnh,
        email: usuario.email,
        telefone: usuario.telefone,
        perfil: usuario.perfil,
      });
      // Senha opcional na edição, não exibimos o valor atual
    }
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.form.reset();
    this.erroDuplicidade = null;
  }

  async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = this.form.value;
    // Sanitização (remover não dígitos) igual ao cadastro público
    dados.cpf = dados.cpf.replace(/\D/g, '');
    dados.cnh = dados.cnh.replace(/\D/g, '');
    dados.telefone = dados.telefone.replace(/\D/g, '');

    try {
      if (this.editando && this.usuarioSelecionado) {
        await firstValueFrom(this.usuarioService.updateUsuario(this.usuarioSelecionado.id, dados));
      } else {
        // Chamar cadastro (POST /usuarios) – mesmo serviço do cadastro público
        await firstValueFrom(this.usuarioService.cadastrar(dados));
      }
      this.fecharModal();
      await this.carregarUsuarios();
    } catch (error: any) {
      const mensagem: string = error.error || error.message;
      if (mensagem.includes('DUPLICADO_')) {
        this.erroDuplicidade = this.mapearErroDuplicidade(mensagem);
      } else {
        alert('Erro ao salvar usuário: ' + mensagem);
      }
    }
  }

  mapearErroDuplicidade(codigo: string): string {
    switch (codigo.trim()) {
      case 'DUPLICADO_CPF': return 'CPF já cadastrado.';
      case 'DUPLICADO_CNH': return 'CNH já cadastrada.';
      case 'DUPLICADO_EMAIL': return 'E-mail já cadastrado.';
      case 'DUPLICADO_TELEFONE': return 'Telefone já cadastrado.';
      default: return 'Erro de duplicidade.';
    }
  }

  async excluir(usuario: Usuario): Promise<void> {
    if (!confirm(`Deseja realmente excluir o usuário ${usuario.nome}?`)) return;
    try {
      await firstValueFrom(this.usuarioService.deleteUsuario(usuario.id));
      await this.carregarUsuarios();
    } catch (error: any) {
      alert('Erro ao excluir veículo: ' + (error.error || error.message));
    }
}}