# Sistema de egressos 
Sistema de Egressos do meu Projeto de TCC para o meu curso de TADS no IFSP

## Banco de dados
MySQL 8 é obrigatório
  
Executar o seguinte script da pasta database: `db_structure.sql`
  
(Recomendado) Executar o script de população de dados para teste: `db_test.sql`

- Usuário administrador de teste:
  - E-mail: `admin@admin.com`
  - Senha: `1234`

## Backend
- Versão do Node utilizada: 22

### Como executar
Criar um arquivo .env na pasta backend com um conteúdo seguindo o arquivo `.env.example`, alterando apenas os espaços `<your_db_user>` e `<your_db_password>` para o login necessário do MySQL.

- Executar o seguinte comando no terminal(na pasta backend):
```
npm i
npm start
```

## Frontend
### Como executar

- Versão do Node utilizada: 22

- Executar o seguinte comando no terminal(na pasta frontend):
```
npm i
npm run dev
```