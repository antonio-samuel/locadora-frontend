import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import {
  cpfValidator,
  cnhValidator,
  telefoneValidator
} from '../../core/validators/documento.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  form: FormGroup;
  carregando = false;

constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router
) {
  this.form = this.fb.group({
    nome:     ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    cpf:      ['', [Validators.required, cpfValidator]],
    cnh:      ['', [Validators.required, cnhValidator]],
    telefone: ['', [Validators.required, telefoneValidator]],
    email:    ['', [Validators.required, Validators.email]],
    senha:    ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
  });
}

  get nome()     { return this.form.get('nome')!;     }
  get cpf()      { return this.form.get('cpf')!;      }
  get cnh()      { return this.form.get('cnh')!;      }
  get telefone() { return this.form.get('telefone')!; }
  get email()    { return this.form.get('email')!;    }
  get senha()    { return this.form.get('senha')!;    }

  get digitosCpf():      number { return (this.cpf.value      ?? '').replace(/\D/g, '').length; }
  get digitosCnh():      number { return (this.cnh.value      ?? '').replace(/\D/g, '').length; }
  get digitosTelefone(): number { return (this.telefone.value ?? '').replace(/\D/g, '').length; }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.carregando = true;

    const payload = {
      nome:     this.nome.value.trim(),
      cpf:      this.cpf.value.replace(/\D/g, ''),
      cnh:      this.cnh.value.replace(/\D/g, ''),
      telefone: this.telefone.value.replace(/\D/g, ''),
      email:    this.email.value.trim(),
      senha:    this.senha.value,
      perfil: 'CLIENTE' as const
    };

    try {
      const corpo = await firstValueFrom(this.authService.cadastrar(payload));
      const usuarioSalvo = JSON.parse(corpo);
      alert(`✅ Cadastro realizado! Bem-vindo(a), ${usuarioSalvo.nome}.`);
      this.form.reset();
      this.router.navigate(['/auth/login']);

    } catch (err: any) {
      const mensagem: string = typeof err.error === 'string' ? err.error : '';

      if (mensagem.includes('DUPLICADO_CPF') || mensagem.includes('DUPLICADO_CNH')) {
        const msgGenerica = { duplicado: 'Documento já cadastrado no sistema.' };
        this.cpf.setErrors(msgGenerica);
        this.cnh.setErrors(msgGenerica);
        alert('❌ Um ou mais documentos (CPF/CNH) já estão em uso.');
      }
      if (mensagem.includes('DUPLICADO_TELEFONE')) {
        this.telefone.setErrors({ duplicado: 'Este telefone já está cadastrado.' });
        alert('❌ Este número de telefone já está cadastrado.');
      }
      if (mensagem.includes('DUPLICADO_EMAIL')) {
        this.email.setErrors({ duplicado: 'Este e-mail já está cadastrado.' });
        alert('❌ Este e-mail já está vinculado a outra conta.');
      }
      if (!mensagem) {
        alert('❌ Não foi possível conectar ao servidor.\nVerifique se o backend está ativo na porta 8081.');
      }

    } finally {
      this.carregando = false;
    }
  }
}