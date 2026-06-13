import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminVeiculosComponent } from './veiculos/admin-veiculos.component';
import { AdminUsuariosComponent } from './usuarios/admin-usuarios.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminVeiculosComponent,
    AdminUsuariosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    // Se houver componentes compartilhados (ex: pipes, directives), importar SharedModule
  ],
})
export class AdminModule {}