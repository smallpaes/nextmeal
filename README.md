# Nextmeal
Nextmeal is an online platform for you to readily access to awesome food nearby with reasonable price. 

<p>&nbsp;</p>

## API Guideline
Kindly check out our [API Docs](https://documenter.getpostman.com/view/8897576/SW17UbmU?version=latest) for more information

<p>&nbsp;</p>

## Installation
The following instructions will get you a copy of the project and the setting needed to run the back-end server on your local machine.

To set up and run the front-end app, kindly check out [Nextmeal: Front-End](https://github.com/smallpaes/nextmeal/tree/master/client#nextmeal-front-end)


### Prerequisites

- [npm](https://www.npmjs.com/get-npm)
- [Node.js v10.16.0](https://nodejs.org/en/download/)
- [MySQL v8.0.16](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench v8.0.16](https://dev.mysql.com/downloads/workbench/)

<p>&nbsp;</p>

### Clone

Clone this repository to your local machine

```
$ git clone https://github.com/smallpaes/nextmeal.git
```

<p>&nbsp;</p>

### Setup Database

**Create database via MySQL Workbench**

> Run the following code
```
drop database if exists nextmeal;
create database nextmeal;
```

<p>&nbsp;</p>


### Setup App

**1. Enter the project folder**

```
$ cd nextmeal
```

**2. Install packages via npm**

```
$ npm install
```

**3. Create .env file**

```
$ touch .env
```

**4. Store API Key in .env file and save**

```
GMAIL_ACCOUNT=
GMAIL_PASSWORD=
JWT_SECRET=
IMGUR_CLIENT_ID=
URL=
MERCHANT_ID=
HASH_KEY=
HASH_IV=
```

**5. Edit password in config.json file**

> /server/config/config.json
```
"development": {
  "username": "root",
  "password": "<YOUR_WORKBENCH_PASSWORD>",
  "database": "nextmeal",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

**6. Run migration**

> At "/server" run the following code in the console
```
$ npx sequelize db:migrate
$ NODE_ENV=test npx sequelize db:migrate
```

**7. Add Seeder**

> At "/server" run the following code in the console
```
$ npx sequelize db:seed:all
```

**8. Activate the server**

```
$ npm run dev
```

**8. Find the message for successful activation**

```
> App is listening on port 3000!
```
You may start using the api by accessing: http://localhost:3000/api

<p>&nbsp;</p>

___


## Authors
- [DannyWang](https://github.com/windate3411)
- [Mike Huang](https://github.com/smallpaes)
- [Tao He](https://github.com/cTaohe)