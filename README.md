# Food Facts API

## Descrição

A Food Facts API é uma aplicação RESTful desenvolvida em Node.js, TypeScript e PostgreSQL, seguindo os princípios de Design Patterns, SOLID e Domain-Driven Design (DDD). A API permite o gerenciamento de informações sobre produtos alimentícios a partir do banco de dados Open Food Facts.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- PostgreSQL
- Knex
- Vitest
- Docker

## Instalação

1. Clone o repositório:

```
git clone https://github.com/ramonrsm/challenge-coodesh-squadfy.git
```

2. Instale as dependências:

```
cd challenge-coodesh-squadfy
npm install
```

3. Configure as variáveis de ambiente:

Duplique o arquivo `.env.exemple` na raiz do projeto e renomeie para `.env` e configure as variáveis de ambiente necessárias.

4. Execute os seguintes comandos para configurar o banco de dados:

```
docker compose -p challenge-coodesh-squadfy -f ./packages/api/docker-compose.dev.yaml up -d
```

*Observação*: Caso não queira usar o docker, você pode baixar o postgres e executar localmente. Link para download: <https://www.postgresql.org/download/>

5. Execute as migrações do banco de dados:

```
npm run migrate:latest
```

. Execute a aplicação:

```
npm run api
```

A API estará disponível em `http://localhost:{API_PORT}/api/v1`.

## Endpoints

A API oferece os seguintes endpoints:

- `GET /products`: Retorna todos os produtos cadastrados.
- `GET /products/:code`: Retorna os detalhes de um produto específico pelo código.
- `POST /products`: Cria um novo produto.
- `PUT /products/:code`: Atualiza os detalhes de um produto existente pelo código.
- `DELETE /products/:code`: Exclui um produto pelo código.

## Testes

Para executar os testes unitários, utilize o seguinte comando:

```
npm test
```

## Docker

A aplicação pode ser executada em um contêiner Docker. Certifique-se de ter o Docker instalado e execute os seguintes comandos:

1. Construa a imagem Docker:

```
docker build -t challenge-coodesh-squadfy .
```

2. Execute o contêiner:

```
docker run -p 3000:3000 challenge-coodesh-squadfy
```

## Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).
