# finanças

## Visão geral

Este projeto é um app de finanças pessoais em React com backend Node.js + MySQL para salvar transações.

## Estrutura do projeto

- `src/` - frontend React + Vite
- `server/` - backend Node.js + Express
- `server/init.sql` - script de criação do banco MySQL
- `public/` - arquivos públicos e PWA

## Backend MySQL

### 1. Configurar o MySQL

No servidor Linux:
```bash
sudo apt update
sudo apt install mysql-server
```

### 2. Criar banco de dados e tabela

A partir do MySQL:
```sql
SOURCE server/init.sql;
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:
```bash
cd server
cp .env.example .env
```

Atualize os valores em `server/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=financas
```

### 4. Instalar dependências do backend

```bash
cd server
npm install
```

### 5. Iniciar o backend

```bash
npm start
```

## Frontend

### 1. Instalar dependências do frontend

```bash
npm install
```

### 2. Iniciar o frontend

```bash
npm run dev
```

O Vite está configurado para enviar `/api` para `http://localhost:4000`.

## Scripts úteis

- `npm run dev` - inicia o frontend
- `npm run backend` - inicia o backend a partir de `server`

## API disponível

- `GET /api/transactions` - lista transações
- `POST /api/transactions` - cria nova transação
- `GET /api/balance` - retorna saldo, receitas e despesas

## Deploy

No servidor você pode rodar o backend em `4000` e usar Nginx para servir o frontend e fazer proxy de `/api` para o backend.

