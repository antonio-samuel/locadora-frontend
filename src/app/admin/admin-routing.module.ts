import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminVeiculosComponent } from './veiculos/admin-veiculos.component';
import { AdminUsuariosComponent } from './usuarios/admin-usuarios.component';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'veiculos', pathMatch: 'full' },
      { path: 'veiculos', component: AdminVeiculosComponent },
      { path: 'usuarios', component: AdminUsuariosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}