import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  activeTab: string = 'veiculos';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Sincroniza a aba ativa com a rota atual
    const url = this.router.url;
    if (url.includes('usuarios')) {
      this.activeTab = 'usuarios';
    } else {
      this.activeTab = 'veiculos';
    }
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.router.navigate([`/admin/${tab}`]);
  }
}