# API End-points

```
POST '/users': cadastro de um usuario
POST '/sessions': autenticacao de um usuario
PUT '/users': atualizacao de um usuario (deve estar autenticado)
GET '/providers': lista usuarios que sao prestadores de servico
GET '/appointments': lista agendamentos de um usuario prestador
POST '/appointments': registra um novo agendamento de um prestador
DELETE '/appointments/:id': cancela um determinado agendamento
GET '/schedule': lista os agentamentos de um usuario
GET '/notifications': lista as notificacoes de um dado usuario
PUT '/notifications/:id': atualiza as notificacoes de um dado usuario
POST '/files': adiciona um arquivo (imagem) referente ao avatar de um usuario
```

# API Start up:

App configurada para interpretar o padrao import/export es6(), ao inves de commonjs(require), atraves do modulo esm
Assim, com essa config, e subindo o projeto junto ao nodemon (auto-update) o script de dev fica:
```
"scripts": {
    "dev": "nodemon -r esm src/server.js"
  }
```
Para subir o projeto localmente:
> yarn dev

# Docker

###### Os servicos de banco de dados e envio de email (filas) rodam em containers Docker
- Criacao de ambientes isolados, que nao interferem em outros servicos e ferramentas da app
- Inslando na maquina ele vai mexer em varios arequivos no sistema operacional e se precisar remover e ou atualizar, teremos problemas... tendo isso rodando num container separado do docker, nao havera interferencia no sistema da maaquina

###### A comunicacao entre os containers se da atraves da exposicao de portas
- Teremos um copntaner de db Postgres rodando na porta :5432
- A app tem acesso a esse servico usando essa porta
- Se quiser trocar o servico e ou atualizar a versao, remover sera muito simples
- Havera outro container db mongoDB que sera conectado a app de forma independente na porta :27017, nao tendo comunicacao com o comntainer postgres

###### Imagem Docker - Servico docker
-  Imagens sao servicos/tecnologias que podem adicionadas dentro de containers docker
###### Containers sao instancias de imagens
- É possivel ter uma imagem de postgres e tres dbs rodando com essa mesma igame, ou seja, 3 dbs rodando postres

## Dockerfile
- Receita de uma imagem, aceita que seja montada a propria imagem
- Define com a imagem da app deve funcionar, é a receita para que a app funcione em um ambiente do zero
  > Partimos de uma imagem existente (a app em si) node 10
  ```
  FROM node:10
  ```

  > Definimos a pasta e copiamos os arquivos
  ```
  WORKDIR /usr/app
  COPY . ./
  ```

  > Instalando as dependências
  ```
  RUN yarn
  ```

  > Qual porta desejada a expor, para que os outros servicos consigam acessar a app
  ```
  EXPOSE 3333
  ```

  > Executa a app
  ```
  CMD yarn start
  ```

###### Criacao de servicos
- Iniciando container com imagem postgres:
  '$ docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres'

  - --name: nome do container postgres
  - -e variável de ambiente de senha do container
  - -p redirecionamento de porta
  - -d nome da imagem que deseja-se utilizar

###### Para utilização via GUI, baixar Postbird e fazer login com os dados passados na criacao do container:
- Login: postgres
- Password: docker

###### Comandos Docker
- $ docker run: cria um novo container docker, onde sera necessario fornecer os parametros
- $ docker ps: lista container ativos
- $ docker ps -a: lista todos os container
- $ docker stop: para os containers docker
- $ docker start database: starta o container especificado

## Sequelize

- ORM (Oriented Relational Model) para abstracao de banco de dados, muda a forma na qual a app se comunica com o DB
- App MVC - Tabelas viram models, cada arquivo de model representa uma tabela dentro do DB
- Manipulacao dos dados do DB
  - Apenas codigo javascrip, nada de SQL

  Exemplo SQL:
  ```INSERT INTO users (name, email) VALUES ("Felipe Rocha", "felipeo.rocha@hotmail.com");```

  Exemplo JS:
  ```
  User.create({
    name: "Felipe Rocha",
    email: "felipeo.rocha@hotmail.com"
  })
  ```

O sequelize tem o papel de fazer a traducao do codigo JS para codigo SQL

  Exemplo SQL:
 ```SELECT *FROM users WHERE email = "felipeo.rocha@hotmail.com";```

  EXEMPLO JS:
  ```
  'User.findOne({
    where: {
      email: "felipeo.rocha@hotmail.com"
    }
  })
  ```

###### Sequelize config

.sequelizerc - arquivo responsavel por exportar os caminhos onde estao os arquvos e pastas de databases, migrations, models...
  - necessario usar sintaxe commonjs
  - necessario exporatar o path para o caminho de config do database
  - necessario exporatar o path para o caminho dos models
  - necessario exporatar o path para o caminho das migrations

config/databse.js - exporta atquivo de configuracao
  - necessario utilizar-se a sintaxe commonjs, pois sera lido pelo sequlize-cli, a qual nao interpreta "export default"
  - necessario informar dialect, host, username, password, databse e define{}


## Migrations
  - Controle de versao para DB
  - Cada arquivo de migrations contem intrucao para criacao, alteracao ou remocao de tabelas ou colunas
  - Efetiva para qualquer tipo de DB(pstgres, mySQL, mySQL Lite...)
  - Metodo up: deve receber a instrucao createTable, responsavel por criar uma nova tabela ao executar a migration
  - Metodo down: recebe a instrucao dropTable, responsavel por deletar a tabela em caso de rollback
  - Apos o desenvolvimento, migrations sao imutaveis, nao deveram ser alteradas. Para adicionar ou mudar um campo na table, deve-se
  criar uma nova migration com a alteracao necessaria.
  - Cada migration deve realizar alteracoes em apenas uma tabela

  Exemplo de criacao da migration da tabela de users:
  - yarn sequelize migration:create --name=create-users // parte do modulo sequelize-cli
  Devera criar o arquivo de migration de usuarios no path src/database/migrations/{random_number}-create-users.js contendo
  os metodos up: createTable() e down: dropTable()

###### Arquitetura

  - MVC
  - Models sao as representacoes de tabelas do DB
  - Controller sao representacao das regras de negocio
    - Nao chamam outros controller/metodos
    - Possuem apenas/no maximo 5 metodos
        ```
        class UserController {
          index() { // ...listagem de usuarios (registro) }
          show() { // ...exibicao de um unico usuario (registro) }
          store() { // ...cadastro de usuario (registro) }
          update() { // ... atualizacao/alteracao de um usuario (registro) }
          delete() { // ... remocao de um usuario (registro) }
        }
        ```
  - Views serao os JSON retornados pelos controllers e consumidos pela app front-end
