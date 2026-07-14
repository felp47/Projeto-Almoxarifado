# 📦 PROJETO-ALMOXARIFADO

Este projeto consiste em um **Sistema de Almoxarifado** robusto e intuitivo, desenvolvido para o gerenciamento e a movimentação de insumos (como bebidas e outros materiais de estoque). A aplicação conta com um painel completo para cadastro, gerenciamento, login e registro detalhado de todas as entradas e saídas de insumos.

O projeto adota uma arquitetura simplificada e eficiente, dividida entre uma API backend em **Node.js + Express** com persistência em banco de dados **SQLite**, e uma interface frontend interativa construída puramente com **HTML, CSS e JavaScript**.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema do projeto foi montado utilizando as seguintes tecnologias:

*   **Frontend:**
    *   **HTML5:** Estruturação semântica de todas as páginas da interface.
    *   **CSS3:** Estilização responsiva, moderna e visualmente limpa para os painéis de controle.
    *   **JavaScript (ES6+):** Manipulação dinâmica do DOM, consumo das rotas de API via Fetch/Axios e lógica de validação do lado do cliente.
*   **Backend:**
    *   **Node.js:** Ambiente de execução JavaScript servido fora do navegador.
    *   **Express.js:** Framework minimalista para criação de servidores HTTP, gerenciamento de rotas e APIs RESTful.
*   **Banco de Dados:**
    *   **SQLite (SGDB):** Banco de dados relacional leve e autocontido (`bebidas_db.sqlite`), integrado diretamente ao backend para persistência segura dos dados.

---

## 📁 Estrutura de Diretórios do Projeto

Abaixo está representada a estrutura de pastas e arquivos mapeada a partir da arquitetura do repositório:

```text
PROJETO-ALMOXARIFADO/
├── back-end/
│   ├── node_modules/             # Dependências instaladas do Node.js
│   ├── bebidas_db.sqlite         # Banco de dados SQLite relacional
│   ├── package-lock.json         # Travamento de versões das dependências
│   ├── package.json              # Configurações do projeto e dependências (Express, SQLite3, etc.)
│   └── server.js                 # Inicialização do servidor Express, rotas da API e conexões com o BD
└── public/                       # Arquivos estáticos servidos ao cliente
    ├── assets/                   # Recursos visuais (imagens, ícones, logos)
    ├── css/                      # Arquivos de estilo para layout e design (.css)
    ├── javaScript/               # Scripts do lado do cliente (Frontend)
    │   ├── cadastro.js           # Lógica para o formulário de cadastro de insumos
    │   ├── gerenciamento.js      # Scripts de controle da listagem e edição de itens
    │   ├── login.js              # Validação e requisições de autenticação de usuários
    │   ├── main.js               # Funcionalidades gerais e painel principal 
    │   └── movimentacoes.js      # Registro e controle de entradas/saídas de insumos
    ├── cadastro-insumos.html     # Página de formulário para inserção de novos materiais
    ├── gerenciador.html          # Painel visual para listagem, alteração e exclusão de insumos
    ├── login.html                # Tela de autenticação e controle de acesso
    ├── main.html                 # Página principal / Menu de navegação do sistema
    └── movimentacoes.html        # Página para registro de fluxos e histórico de movimentação