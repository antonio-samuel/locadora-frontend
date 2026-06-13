import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const usuario = this.authService.getSessao();
    if (usuario?.perfil === 'ADMIN') {
      return true;
    }
    this.router.navigate(['/catalogo']);
    return false;
  }
}