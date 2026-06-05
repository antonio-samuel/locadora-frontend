import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
   path: '',
  redirectTo: 'catalogo',
  pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'catalogo',
    loadChildren: () =>
      import('./catalogo/catalogo.module').then(m => m.CatalogoModule)
  },
  {
  path: 'perfil',
  loadChildren: () =>
    import('./perfil/perfil.module').then(m => m.PerfilModule),
  canActivate: [AuthGuard]
},
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
 {
  path: '**',
  redirectTo: 'catalogo'
}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}