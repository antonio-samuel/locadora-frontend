import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CatalogoComponent } from './catalogo.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: CatalogoComponent }
];

@NgModule({
  declarations: [CatalogoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CatalogoModule {}