# API - Consumo de Água e Gás

Este projeto consiste em uma API onde é utilizado o Google Gemini para extrair o valor de um medidor de gás/água a partir de uma imagem.
Foram utilizadas as seguintes tecnologias:

- NestJS
- TypeORM
- Typescript
- PostgreSQL
- Docker

## Modo de uso

1. Criar um arquivo ".env" na raiz do diretório, contendo a chave da API do Google Gemimi:

```bash
GEMINI_API_KEY=<sua-chave-do-gemini>
```

2. Como o projeto está Dockerizado, rode através do seguinte comando:

```bash
docker compose up
```

Obs: É necessário ter o Docker instalado.
