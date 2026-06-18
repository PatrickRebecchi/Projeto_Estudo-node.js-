# ProjetoApi

Sistema full-stack de gerenciamento de usuarios com autenticacao JWT e controle de acesso baseado em roles (admin/user). Backend em Express.js + MongoDB e frontend em Angular.

## Tecnologias

### Backend
- Node.js (ESM)
- Express.js v5
- Prisma ORM (MongoDB)
- JWT + bcrypt
- Zod (validacao)
- Helmet + CORS
- Morgan (logging)

### Frontend
- Angular v21
- TypeScript
- RxJS
- Vitest (testes)

## Funcionalidades

- Registro e login de usuarios com JWT
- CRUD completo de usuarios
- Controle de roles: primeiro registro vira admin, demais sao user
- Protecao de rotas no frontend (auth guard + interceptor)
- Dashboard com auto-refresh para admins
- Validacao de dados com Zod
- Middleware de erro centralizado

## Estrutura do projeto

```
├── prisma/
│   └── schema.prisma          # Schema do Prisma (model User)
├── src/
│   ├── server.js              # Entry point do servidor
│   ├── config/env.js          # Carregamento e validacao de variaveis de ambiente
│   ├── middleware/
│   │   ├── auth.middleware.js # Verificacao de JWT e checagem de admin
│   │   ├── error.middleware.js # Tratamento centralizado de erros
│   │   └── async-handler.js   # Wrapper para erros assincronos
│   ├── routes/
│   │   ├── auth.routes.js     # POST /login, POST /register
│   │   └── users.routes.js    # CRUD de usuarios
│   ├── controllers/
│   │   ├── auth.controller.js # Handlers de login e registro
│   │   └── user.controller.js # Handlers de CRUD de usuarios
│   ├── services/
│   │   ├── auth.service.js    # JWT, bcrypt, autenticacao
│   │   └── user.service.js    # Queries Prisma para usuarios
│   ├── validators/
│   │   └── user.validator.js  # Schemas Zod
│   ├── prisma/client.js       # Singleton do PrismaClient
│   └── scripts/
│       ├── seed.js            # Seed do admin inicial
│       ├── repair-age.js      # Reparacao de dados de idade
│       └── create-indexes.js  # Criacao de indices
└── frontend/
    └── src/
        ├── app/
        │   ├── core/
        │   │   ├── guards/auth.guard.ts
        │   │   └── interceptors/auth.interceptor.ts
        │   ├── features/
        │   │   ├── login/
        │   │   ├── register/
        │   │   └── dashboard/
        │   └── app.routes.ts
        └── environments/
```

## Pre-requisitos

- Node.js >= 18
- MongoDB (local ou Atlas)
- npm ou yarn

## Instalacao

```bash
# Instalar dependencias do backend
npm install

# Instalar dependencias do frontend
cd frontend
npm install
cd ..
```

## Configuracao

Crie um arquivo `.env` na raiz do projeto baseado nas variaveis abaixo:

```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/projetoapi
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:4200
```

### Variaveis de ambiente

| Variavel | Descricao | Padrao |
|---|---|---|
| `PORT` | Porta do servidor | `3000` |
| `DATABASE_URL` | Connection string do MongoDB | obrigatoria |
| `JWT_SECRET` | Chave secreta para assinar JWTs | obrigatoria em producao |
| `JWT_EXPIRES_IN` | Tempo de expiracao do token | `8h` |
| `CORS_ORIGIN` | Origens permitidas no CORS | `http://localhost:4200` |
| `SEED_USER_EMAIL` | Email do usuario admin seed | `admin@example.com` |
| `SEED_USER_PASSWORD` | Senha do usuario admin seed | `123456` |
| `SEED_USER_NAME` | Nome do usuario admin seed | `Administrador` |
| `SEED_USER_AGE` | Idade do usuario admin seed | `30` |

> **Importante**: Altere o `JWT_SECRET` em producao. A aplicacao valida isso no startup.

## Rodando o projeto

### Backend (desenvolvimento)
```bash
npm run dev
```
O servidor roda em `http://localhost:3000`.

### Frontend (desenvolvimento)
```bash
cd frontend
npm run start
```
O frontend roda em `http://localhost:4200`.

### Banco de dados
```bash
# Gerar client Prisma
npm run prisma:generate

# Popular banco com admin inicial
npm run db:seed

# Criar indices
npm run db:indexes
```

## API Endpoints

### Auth
| Metodo | Rota | Descricao | Acesso |
|---|---|---|---|
| POST | /auth/login | Autentica e retorna JWT | publico |
| POST | /auth/register | Cria novo usuario | publico |

### Users
| Metodo | Rota | Descricao | Acesso |
|---|---|---|---|
| GET | /users | Lista todos os usuarios | autenticado |
| GET | /users/:id | Busca usuario por ID | autenticado |
| POST | /users | Cria usuario | admin |
| PUT | /users/:id | Atualiza usuario | admin |
| PATCH | /users/:id/role | Alterna role do usuario | admin |
| DELETE | /users/:id | Remove usuario | admin |

### Health
| Metodo | Rota | Descricao | Acesso |
|---|---|---|---|
| GET | /health | Health check | publico |

## Scripts disponiveis

### Backend
| Script | Comando | Descricao |
|---|---|---|
| `dev` | `node --watch src/server.js` | Servidor com hot reload |
| `start` | `node src/server.js` | Servidor em producao |
| `db:seed` | `node src/scripts/seed.js` | Seed do banco |
| `db:repair-age` | `node src/scripts/repair-age.js` | Repara campo age |
| `db:indexes` | `node src/scripts/create-indexes.js` | Cria indices |
| `prisma:generate` | `prisma generate` | Gera Prisma client |
| `test` | `node --test` | Testes backend |

### Frontend
| Script | Comando | Descricao |
|---|---|---|
| `start` | `ng serve` | Dev server |
| `build` | `ng build` | Build de producao |
| `watch` | `ng build --watch` | Build em watch mode |
| `test` | `ng test` | Testes unitarios |

## Arquitetura

- **Padrao**: Arquitetura em camadas (Routes → Controllers → Services → Prisma)
- **Validacao**: Schemas Zod aplicados como middleware nas rotas
- **Erros**: Middleware centralizado trata Zod, Prisma (P2002, P2025) e erros genericos
- **Auth**: JWT Bearer token verificado por `authMiddleware`; `adminMiddleware` restringe rotas de admin
- **Roles**: Primeiro usuario registrado vira admin automaticamente
