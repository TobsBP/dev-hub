# 🚀 DevHub

Uma rede social para desenvolvedores — compartilhe posts, snippets de código, interaja com a comunidade e construa sua reputação.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Uso](#instalação-e-uso)
- [Testes](#testes)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Sobre o Projeto

O **DevHub** é o frontend de uma plataforma social voltada a desenvolvedores. A aplicação consome a DevSocial API e oferece uma interface para que devs publiquem conteúdo, compartilhem código, comentem, curtam, e acompanhem sua reputação na comunidade.

---

## Tecnologias

- **Framework**: React / Next.js
- **Testes E2E**: [Cypress](https://www.cypress.io/)
- **Gerenciador de pacotes**: npm

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

---

## Instalação e Uso

**1. Clone o repositório**

```bash
 git clone https://github.com/seu-usuario/dev-hub.git
```

**2. Acesse a pasta do projeto**

```bash
cd dev-hub
```

**3. Instale as dependências**

```bash
npm install
```

**4. Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Testes

O projeto utiliza **Cypress** para testes end-to-end.
Obs: o cypress é muito rapido, logo alguns testes podem falhar a depender do desempenho da maquina utlizada e também a depender da resposta da api.
**Abrir a interface interativa do Cypress:**

```bash
npx cypress open
```

**Rodar os testes em modo headless (CI):**

```bash
npx cypress run
```

---

## Funcionalidades

- 👤 Cadastro e login de usuários
- 📝 Criação de posts
- 💬 Comentários com suporte a respostas encadeadas
- ❤️ Curtidas em posts

---

## Estrutura do Projeto
falta arrumar
```
dev-hub/
├── public/             # Arquivos estáticos
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Integração com a API
│   ├── hooks/          # Custom hooks
│   └── styles/         # Estilos globais
├── cypress/
│   ├── e2e/            # Testes end-to-end
│   └── support/        # Configurações do Cypress
├── package.json
└── README.md
```
