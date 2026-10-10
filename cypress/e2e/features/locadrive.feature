2. Cenarios Gherkin / BDD
Arquivo: locadrive.feature — compatível com Cucumber / Cypress Cucumber Preprocessor
 

Funcionalidade: Autenticação de usuário
  Como cliente do LocaDrive
  Quero fazer login com minhas credenciais
  Para acessar minha área e gerenciar minhas locações

  Contexto:
    Dado que o usuário "joao@email.com" com senha "1234" está cadastrado

  Cenário: Login com credenciais válidas
    Quando eu acesso a tela de login
    E preencho o email "joao@email.com"
    E preencho a senha "1234"
    E clico em "Entrar"
    Então devo ser redirecionado para "/catalogo"
    E o nome do usuário deve aparecer na navbar

  Cenário: Login com senha incorreta
    Quando eu acesso a tela de login
    E preencho o email "joao@email.com"
    E preencho a senha "senhaerrada"
    E clico em "Entrar"
    Então devo ver uma mensagem de erro de autenticação
    E devo permanecer na tela de login

  Cenário: Login com email em formato inválido
    Quando eu acesso a tela de login
    E preencho o email "emailsemarroba.com"
    Então o campo de email deve ser marcado como inválido
    E o botão "Entrar" deve estar desabilitado

Funcionalidade: Cadastro de novo usuário
  Como visitante do LocaDrive
  Quero criar uma conta
  Para poder alugar veículos

  Cenário: Cadastro bem-sucedido
    Dado que não existe nenhum usuário com o CPF "12345678901"
    Quando eu acesso a aba "Cadastrar"
    E preencho o formulário com:
      | campo    | valor              |
      | nome     | João Silva         |
      | email    | joao@email.com     |
      | cpf      | 12345678901        |
      | cnh      | 12345678901        |
      | telefone | 61987654321        |
      | senha    | 1234               |
    E clico em "Cadastrar"
    Então devo ser redirecionado para "/catalogo"

  Cenário: Cadastro com CPF já existente
    Dado que já existe um usuário com o CPF "12345678901"
    Quando eu tento cadastrar outro usuário com o mesmo CPF
    Então devo ver a mensagem "CPF ou CNH já cadastrado" nos campos CPF e CNH

  Cenário: Senha abaixo do mínimo
    Quando eu acesso a aba "Cadastrar"
    E preencho o campo "senha" com "abc"
    Então o campo senha deve exibir erro de validação
    E o formulário não deve ser enviado

Funcionalidade: Fluxo completo de locação
  Como cliente autenticado
  Quero alugar um veículo disponível
  Para utilizá-lo no período desejado

  Contexto:
    Dado que estou autenticado como cliente
    E existe um veículo "Toyota Corolla" disponível com diária de R$ 120,00

  Cenário: Abertura de locação com datas válidas
    Quando acesso o dashboard
    E seleciono o veículo "Toyota Corolla"
    E defino a data de retirada como "amanhã"
    E defino a data de devolução como "daqui a 5 dias"
    E clico em "Confirmar Locação"
    Então a locação deve ser criada com status "ATIVA"
    E o veículo "Toyota Corolla" deve ficar indisponível
    E o valor calculado deve ser "R$ 600,00"

  Cenário: Simulação de devolução com atraso de 2 dias
    Dado que possuo uma locação ativa com devolução prevista para "hoje"
    Quando abro o modal de simulação de devolução
    E seleciono a data de devolução como "daqui a 2 dias"
    Então o valor estimado deve incluir a multa de 2% por dia de atraso
    E um badge de alerta deve ser exibido

  Cenário: Cancelamento de locação ativa
    Dado que possuo uma locação com status "ATIVA"
    Quando clico em "Cancelar" e confirmo a ação
    Então a locação deve ter status "CANCELADA"
    E o veículo deve ficar disponível novamente

Funcionalidade: Pagamento de locação
  Como cliente com locação aguardando pagamento
  Quero realizar o pagamento
  Para concluir a locação

  Contexto:
    Dado que estou autenticado como cliente
    E possuo uma locação com status "AGUARDANDO_PAGAMENTO"

  Cenário: Pagamento via PIX
    Quando clico em "Pagar"
    E seleciono a forma de pagamento "PIX"
    E confirmo o pagamento
    Então a locação deve ter status "CONCLUIDA_NO_PRAZO" ou "CONCLUIDA_COM_ATRASO"
    E o pagamento deve ser registrado no sistema

  Cenário: Pagamento via Cartão de Crédito
    Quando clico em "Pagar"
    E seleciono a forma de pagamento "Cartão de Crédito"
    E confirmo o pagamento
    Então a locação deve ser concluída com sucesso
    E o método de pagamento deve constar como "CREDITO"

Funcionalidade: Controle de acesso ao painel administrativo
  Como sistema de segurança
  Quero restringir o acesso ao /admin
  Para proteger operações sensíveis

  Cenário: Admin acessa o painel com sucesso
    Dado que estou autenticado como usuário com perfil "ADMIN"
    Quando navego para "/admin"
    Então devo ver o painel administrativo
    E as abas "Veículos" e "Usuários" devem estar visíveis

  Cenário: Cliente tenta acessar o painel admin
    Dado que estou autenticado como usuário com perfil "CLIENTE"
    Quando tento navegar para "/admin"
    Então devo ser redirecionado para "/catalogo"
    E o link "Painel Admin" não deve aparecer na navbar
