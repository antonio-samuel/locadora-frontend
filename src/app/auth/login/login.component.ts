import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  form: FormGroup;
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  get email() { return this.form.get('email')!; }
  get senha() { return this.form.get('senha')!; }

 async onSubmit(): Promise<void> {
  this.form.markAllAsTouched();
  if (this.form.invalid) return;

  this.carregando = true;
  const { email, senha } = this.form.value;

  try {
  const usuario = await firstValueFrom(this.authService.login(email, senha));
  this.authService.salvarSessao(usuario);
  this.router.navigate(['/catalogo']);

} catch {
  this.email.setErrors({ credenciaisInvalidas: true });
  this.senha.setErrors({ credenciaisInvalidas: true });

} finally {
  this.carregando = false;
}
}
}