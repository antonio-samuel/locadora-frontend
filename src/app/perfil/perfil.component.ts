import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../core/services/auth.service';
import { UsuarioService } from '../core/services/usuario.service';
import { Usuario } from '../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  usuarioLogado: Usuario | null = null;
  form: FormGroup;
  carregando = false;
  mensagemSucesso = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome:     ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      telefone: ['', [Validators.required]],
      email:    ['', [Validators.required, Validators.email]],
      senha:    ['', [Validators.minLength(4), Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {
    this.usuarioLogado = this.authService.getSessao();
    if (!this.usuarioLogado) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Preenche o formulário com os dados atuais
    this.form.patchValue({
      nome:     this.usuarioLogado.nome,
      telefone: this.usuarioLogado.telefone,
      email:    this.usuarioLogado.email
    });
  }

  get nome()     { return this.form.get('nome')!;     }
  get telefone() { return this.form.get('telefone')!; }
  get email()    { return this.form.get('email')!;    }
  get senha()    { return this.form.get('senha')!;    }

  async salvar(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.carregando = true;
    this.mensagemSucesso = '';

    const payload: any = {
      nome:     this.nome.value.trim(),
      telefone: this.telefone.value.replace(/\D/g, ''),
      email:    this.email.value.trim(),
      cpf:      this.usuarioLogado!.cpf,
      cnh:      this.usuarioLogado!.cnh,
      perfil:   this.usuarioLogado!.perfil
    };

    // Só envia senha se foi preenchida
    if (this.senha.value) {
      payload.senha = this.senha.value;
    }

    try {
      const usuarioAtualizado = await firstValueFrom(
        this.usuarioService.atualizar(this.usuarioLogado!.id!, payload)
      );

      // Atualiza a sessão com os novos dados
      this.authService.salvarSessao(usuarioAtualizado);
      this.usuarioLogado = usuarioAtualizado;
      this.mensagemSucesso = 'Perfil atualizado com sucesso!';
      this.senha.reset();

    } catch (err: any) {
      const mensagem: string = typeof err.error === 'string' ? err.error : '';
      if (mensagem.includes('DUPLICADO_EMAIL')) {
        this.email.setErrors({ duplicado: 'Este e-mail já está em uso.' });
      } else if (mensagem.includes('DUPLICADO_TELEFONE')) {
        this.telefone.setErrors({ duplicado: 'Este telefone já está em uso.' });
      } else {
        alert('❌ Erro ao atualizar perfil. Tente novamente.');
      }
    } finally {
      this.carregando = false;
    }
  }
}