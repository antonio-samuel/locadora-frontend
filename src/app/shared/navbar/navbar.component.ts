import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { Notificacao } from '../../core/models/notificacao.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  // Variáveis de estado para as notificações
  usuarioLogado: any = null;
  notificacoes: Notificacao[] = [];
  contadorNaoLidas = 0;

  constructor(
    public authService: AuthService,
    private notificacaoService: NotificacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Usa o seu AuthService para pegar os dados do usuário logado
    const sessao = this.authService.getSessao();
    if (sessao && sessao.id) {
      this.carregarNotificacoes(sessao.id);
    }
  }

  // Passamos o ID diretamente como parâmetro
  async carregarNotificacoes(usuarioId: number): Promise<void> {
    try {
      this.notificacoes = await this.notificacaoService.buscarPorUsuario(usuarioId);
      this.atualizarContador();
    } catch (error) {
      console.error('Erro ao carregar notificações', error);
    }
  }

  atualizarContador(): void {
    this.contadorNaoLidas = this.notificacoes.filter(n => !n.lida).length;
  }

  async marcarComoLida(notificacao: Notificacao): Promise<void> {
    if (notificacao.lida) return;

    try {
      await this.notificacaoService.marcarComoLida(notificacao.id);
      // Atualiza o estado visual instantaneamente sem recarregar do backend
      notificacao.lida = true;
      this.atualizarContador();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida', error);
    }
  }

  logout(): void {
    // Chama o seu serviço de autenticação
    this.authService.logout();
    
    // Limpa o estado local das notificações
    this.usuarioLogado = null;
    this.notificacoes = [];
    this.contadorNaoLidas = 0;
    
    // Redireciona
    this.router.navigate(['/catalogo']);
  }
}