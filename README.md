## API REST com CRUD e Sistema de Autenticação

Esta API REST implementa todas as operações CRUD (Create, Read, Update, Delete), além de um sistema de registro de contas e login com geração de tokens JWT. O armazenamento dos dados é feito utilizando o [Supabase](https://supabase.com/) e o [Prisma](https://www.prisma.io/) para o gerenciamento do banco de dados, e as requisições são gerenciadas através do framework [Express](https://expressjs.com/).

### Funcionalidades:

- **CRUD Completo**: Operações de criação, leitura, atualização e exclusão.
- **Autenticação JWT**: Geração e validação de tokens JWT para autenticação segura.
- **Registro de Contas**: Sistema para criar e gerenciar contas de usuário.
- **Armazenamento**: Utiliza Supabase e Prisma como soluções de banco de dados.
- **Captura de Requisições**: Gerenciamento eficiente das requisições HTTP com Express.

### Tecnologias Utilizadas:

- Node.js
- Express
- JWT (JSON Web Token)
- Supabase
- Prisma
