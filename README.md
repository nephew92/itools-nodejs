# iTools app
This application presents a web system to manage commercial customers of a hypothetical company.

The server-side was developed with [node.js](https://nodejs.org/en/) using [expressjs](http://expressjs.com/) to buid easily the web application and [express-validator](https://express-validator.github.io/) to validate the forms data.
The client-side use [bootstrap](https://getbootstrap.com/) to improve page view, as well as others Javascript frameworks to manage the data.


# Installation

Enter the application directory after clone or download. Run the following commands at your preferred OS. Instructions for installing some tools have been omitted, see the instructions on the official tool page if necessary.

## Web server

The application was developed with [node.js](https://nodejs.org/en/) 10.9 Javascript framework. Install it before start, as well [NPM](https://www.npmjs.com) package.

* Install the Node modules

  ```bash
  npm install
  ```


## Database
The application use the [DBMS](https://en.wikipedia.org/wiki/Database) [MySQL 5.7](https://www.mysql.com/) without [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping). 
So it's necessary build the database before start the web server. 

### Installing and building the database

* To install the MySQL see the [documentation](https://dev.mysql.com/doc/refman/5.7/en/).

* To build the database run:

  ```bash
  mysql -u user -p < db/create-db.sql
  ```

* To import the data sample run:

  ```bash
  mysql -u user -p < db/predata-db.sql
  ```

Use your mysql user instead _user_

### Configure the mysql user and password:

Edit the file `config.js` and change the mysql _user_, _password_ and  _hostname_ where the database was installed.


# Running

To start the web server run:

```bash
npm start
```

or 

```bash
npm devstart
```
# Usage

The app accepts just valid CPFs according to the [function](http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js) provide by [Receita Federal](http://www.receita.fazenda.gov.br). Some valid hypothetical CPFs are suggested below:

* 840.601.842-92
* 464.933.147-12
* 387.976.646-00
* 627.172.884-73
* 176.843.422-07
* 564.879.843-10
