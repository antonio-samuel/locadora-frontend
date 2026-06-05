import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PerfilComponent } from './perfil.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: PerfilComponent }
];

@NgModule({
  declarations: [PerfilComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PerfilModule {}