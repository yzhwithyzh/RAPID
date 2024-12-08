#### Software architecture

- ADMIN (Administrator): `Vue3, Vite4, Ant Design Vue3, JavaScript, Pinia, Hooks, vue-router4`

- SERVER (Server): `Node.js, Express.js, Mysql5.6, Sequelize`

- FRONTED (Front-end): `Vue3, JavaScript, Hooks, vue-router4`

#### Installation tutorial

By default, you have installed node environment, mysql5.* database, vue3, navicat (software optional)

#### run SERVER (Server)

##### 1. Create a database

Open navicat to connect to mysql and create a new database mealpass - Run sql file (`SERVER/sql/mealpass.sql`)

##### 2. Modify project configuration

Find `SERVER/.env.development` and modify it to your database information

```shell
DB_NAME=mealpass # Database name
DB_USERNAME=root # Database username
DB_PASSWORD=root # Database password
```

Find `SERVER/.env` and modify it to your openai key

```shell
OPENAI_API_KEY = '********'
OPENAI_API_MODEL = 'deepseek-chat'
```

##### 3. Install dependencies and start the service

```shell
# Enter the following commands in sequence
> npm i
> node app.js or nodemon app.js (use when nodemon is installed globally)
```

##### 4. Successful startup example

```shell
****************************************************
[Interface address]: http://localhost:3000/v1
[Document address]: http://localhost:3000/swagger
[Online API documentation]: https://console-docs.apipost.cn/preview/38398488376e89f7/a8cca560fbceec30
[Startup environment]: Development environment

********************************************************
******************Database connection successful********************
[Database]: Database connection has been successfully established.
[Database host]: localhost
[Database name]: mealpass
[Database status]: Database and table have been synchronized
******************Database connection successful********************

```

#### Start ADMIN (Administrator)

##### 1. Install dependencies and start the service

```shell
# Enter the following commands in sequence
> npm i
> npm run dev
```

##### 2. Startup success example

```shell
VITE v4.2.1 ready in 2077 ms

➜ Local: http://localhost:3090/
➜ Network: http://192.168.0.15:3090/
➜ press h to show help

```

> After the management end is successfully started, the account and password are: admin 123456

#### Start FRONTED (front end)

##### 1. Install dependencies and start the service

```shell
# Enter the following commands in sequence
> npm i
> npm run dev
```

##### 2. Successful startup example

```shell

App running at:
- Local: http://localhost:8080/
- Network: http://localhost:8080/

```