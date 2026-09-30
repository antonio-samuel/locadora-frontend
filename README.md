# 🚘 LocaDrive — Frontend (Angular)

O **LocaDrive Frontend** é uma aplicação Web (SPA) moderna construída em Angular 18, projetada para oferecer uma experiência ágil e intuitiva tanto para clientes de aluguel de carros quanto para administradores do sistema.

---

## 🛠️️ Tecnologias Utilizadas

- **Framework:** Angular 18 (Arquitetura por NgModules)
- **Linguagem:** TypeScript 5.5
- **Estilização & Componentes:** Bootstrap 5.3.3 & CSS3
- **Comunicação com API:** Angular `HttpClient` (RxJS com `firstValueFrom` e `async/await`)
- **Rotas e Segurança:** Angular Router & AuthGuards

---

## 📂 Estrutura de Módulos

- `core/`: Serviços globais (`HttpClient`), Guards de rota, Validators e Models.
- `shared/`: Componentes reutilizáveis (Navbar compartilhada).
- `auth/`: Módulo de Login e Cadastro com abas dinâmicas e validação em tempo real.
- `catalogo/`: Vitrine pública de veículos com busca e filtros (Sedan, SUV, Hatch, Pickup).
- `dashboard/`: Área do cliente para gestão de reservas, simulação de devolução e pagamento.
- `admin/`: Painel restrito para administradores com CRUD de veículos e usuários.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (Versão 18 ou superior)
- [npm](https://www.npmjs.com/) (Gerenciador de pacotes incluso no Node)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/antonio-samuel/locadora-frontend.git](https://github.com/antonio-samuel/locadora-frontend.git)
   cd locadora-frontend/locadrive

   Instale as dependências do projeto:

  Bash
  npm install
Inicie o servidor de desenvolvimento:

  Bash
  ng serve
  Acesse a aplicação:
Abra o seu navegador e acesse http://localhost:4200/
