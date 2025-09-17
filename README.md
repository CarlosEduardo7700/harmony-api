## Descrição

API desenvolvida usando NestJS para um Sistema de Gerenciamento para Escolas de Música.

## Setup do projeto

1. Baixe as dependências do projeto:

```bash
$ npm install
```

2. Crie uma pasta chamada `credentials` dentro do diretório `/src`. Dentro desta pasta, adicione o arquivo `google-service-account.json` contendo sua chave de conta de serviço do Google Cloud.

3. Na raiz do projeto, copie o arquivo `.env.example` para criar o arquivo `.env`. Em seguida, preencha as variáveis de ambiente necessárias neste arquivo.

## Compilar e executar o projeto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Executar testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoints

### Lesson

| Método        | URL             |
| ------------- | --------------- |
| POST          | /lesson         |
| POST          | /lesson/schedule-with-recurrence       |
| GET           | /lesson?month={month}&year={year}  |
| PATCH         | /lesson/{id}  |
| DELETE        | /lesson/{id}  |
