# 📦 PROJETO-ALMOXARIFADO

Este projeto consiste em um **Sistema de Almoxarifado** robusto e intuitivo, desenvolvido para o gerenciamento e a movimentação de insumos (como bebidas e outros materiais de estoque). A aplicação conta com um painel completo para cadastro, gerenciamento, login e registro detalhado de todas as entradas e saídas de itens.

O projeto adota uma arquitetura eficiente, dividida entre uma API backend em **Node.js + Express** com persistência em banco de dados **SQLite**, e uma interface frontend interativa construída puramente com **HTML5, CSS3 e JavaScript (ES6+)**.

---

## 📌 Conteúdo

*   [🔑 Credenciais de Acesso](#-credenciais-de-acesso)
*   [🎓 Principais Aprendizados e Conceitos Aplicados](#-principais-aprendizados-e-conceitos-aplicados)
*   [🛠️ Tecnologias Utilizadas](#-tecnologias-utilizadas)
*   [📁 Estrutura de Diretórios](#-estrutura-de-diretórios)
*   [🚀 Como Executar o Projeto](#-como-executar-o-projeto)

---

## 🔑 Credenciais de Acesso

Para testar a aplicação e navegar por todos os painéis do sistema, utilize uma das seguintes contas cadastradas:

| Perfil de Acesso | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin@bebidas.com` | `123456` |
| **Gerente** | `gerente@bebidas.com` | `654321` |

---

## 🎓 Principais Aprendizados e Conceitos Aplicados

A construção deste projeto foi uma excelente jornada prática de engenharia de software, onde conceitos fundamentais de desenvolvimento Full Stack foram consolidados:

### ⚡ 1. O Poder do JavaScript como Linguagem Única
Trabalhar com JavaScript tanto no Frontend quanto no Backend provou o quão poderosa e versátil essa linguagem é. A capacidade de criar a interatividade visual no navegador e, ao mesmo tempo, gerenciar regras de negócios e segurança no servidor utilizando a mesma linguagem otimiza o fluxo de desenvolvimento e unifica a sintaxe do projeto.

### 🌐 2. Node.js e Express: Criação de Servidores e Rotas
*   **Node.js como Ambiente de Execução:** Compreensão de como o JavaScript roda fora do navegador (no lado do servidor), permitindo acesso a arquivos do sistema, segurança e conexões com bancos de dados.
*   **Express.js e Rotas HTTP:** Aprendizado prático na estruturação de uma API RESTful. Foram criadas rotas para verbos HTTP essenciais (como `GET` para buscar dados, `POST` para criar registros de movimentações e `PUT`/`DELETE` no gerenciamento de insumos).

### 🔌 3. Integração e Conexão entre Frontend e Backend
Entendimento de como a interface do usuário se comunica de forma assíncrona com o servidor através da API Fetch. Esse fluxo envolve:
1.  O cliente envia dados (ex: formulário de login) via requisição HTTP.
2.  O servidor (Express) recebe, processa e valida esses dados.
3.  O servidor responde em formato **JSON**.
4.  O JavaScript do frontend interpreta a resposta e atualiza a tela do usuário de forma dinâmica (sem precisar recarregar a página).

### 💾 4. SQLite: Praticidade e Interação com Banco de Dados Relacional
O **SQLite** foi a escolha ideal para esta aplicação pela sua natureza autocontida e leveza (sem necessidade de configurar servidores de banco de dados complexos como Postgres ou MySQL).
*   **Como o banco interage:** O backend em Node.js utiliza comandos SQL para realizar operações de leitura e escrita diretamente no arquivo `bebidas_db.sqlite`.
*   O aprendizado envolveu a criação de tabelas, inserção de registros, consultas filtradas e a garantia de que as transações de entrada e saída de estoque se mantenham íntegras.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema do projeto foi montado utilizando as seguintes tecnologias:

*   **Frontend:**
    *   **HTML5:** Estruturação semântica de todas as páginas da interface.
    *   **CSS3:** Estilização responsiva, moderna e visualmente limpa para os painéis de controle.
    *   **JavaScript (ES6+):** Manipulação dinâmica do DOM, consumo das rotas de API via Fetch e lógica de validação do lado do cliente.
*   **Backend:**
    *   **Node.js:** Ambiente de execução do servidor.
    *   **Express.js:** Framework minimalista para criação do servidor HTTP e gerenciamento de rotas.
*   **Banco de Dados:**
    *   **SQLite:** Banco de dados relacional leve integrado diretamente ao backend para persistência segura dos dados.

---

## 📁 Estrutura de Diretórios

Abaixo está representada a arquitetura estrutural de pastas e arquivos do repositório:

```text
PROJETO-ALMOXARIFADO/
├── back-end/
│   ├── node_modules/         # Dependências instaladas do Node.js
│   ├── bebidas_db.sqlite     # Banco de dados SQLite relacional (arquivo)
│   ├── package-lock.json     # Travamento de versões das dependências
│   ├── package.json          # Configurações do projeto e scripts
│   └── server.js             # Inicialização do servidor Express, rotas da API e conexão com BD
└── public/                   # Arquivos estáticos servidos ao cliente (Frontend)
    ├── assets/               # Recursos visuais (imagens, ícones, logos)
    ├── css/                  # Arquivos de estilo para layout e design (.css)
    ├── javaScript/           # Scripts do lado do cliente
    │   ├── cadastro.js       # Lógica para o formulário de cadastro de insumos
    │   ├── gerenciamento.js  # Controle de listagem, edição e exclusão de itens
    │   ├── login.js          # Validação e requisições de login
    │   ├── main.js           # Funcionalidades gerais do painel principal
    │   └── movimentacoes.js  # Registro e controle de entradas/saídas
    ├── cadastro-insumos.html # Tela para inserção de novos materiais
    ├── gerenciador.html      # Tela visual para manutenção dos insumos
    ├── login.html            # Tela de autenticação e controle de acesso
    ├── main.html             # Painel principal / Menu do sistema
    └── movimentacoes.html    # Tela para controle do histórico de fluxo do estoque
