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

Each customer should have a _name_, _CPF_, _e-mail_, _situation_ (active or inactive) and one or more _phone numbers_.

It will be accepted just valid CPFs according to the [function](http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js) provide by [Receita Federal](http://www.receita.fazenda.gov.br). Some valid hypothetical CPFs are suggested below:

* 840.601.842-92
* 464.933.147-12
* 387.976.646-00
* 627.172.884-73
* 176.843.422-07
* 564.879.843-10

## API REST

It is a RESTful application, this imply that is possible create, read, update and delete customers from HTTP POST and GET methods.

This API is available for requests from [localhost:8888/customers](http://localhost:8888/customers):

### POST requests:

* **[localhost:8888/customers](http://localhost:8888/customers)**: CREATE or UPDATE customers. It's required submit all this following data. If exists any problem with these parameters errors messages could be returned: 
  * **name**,
  * **cpf**: just numbers,
  * **email**,
  * **state**: 0 or 1,
  * **phones**: JSON array of objects `{"<type>":"<phone_number>"}`. `<type>` should be _mobile_, _home_, _work_ or _fax_.

* **[localhost:8888/customers/delete](http://localhost:8888/customers/delete)**: DELETE one or more customers. Return `1` if the customer was deleted and `0` if not. The CPF of the customers should be submitted as the following parameter:
  * **cpfs**: one or more CPF separated by comma.

* **[localhost:8888/customers/:cpf:/setstate](http://localhost:8888/customers/:cpf:/setstate)**: UPDATE customer just changing the state. Return `1` if the customer state was updated and `0` if not. The state value should be submitted as following:
  * **state**: 0 (inactive) or 1 (active)


### GET requests:

* **[localhost:8888/customers](http://localhost:8888/customers)**: Return a JSON with all customers.
* **[localhost:8888/customers/:cpf:](http://localhost:8888/customers/:cpf:)**: Return a JSON with the customer specified.
* **[localhost:8888/customers/:cpf:/delete](http://localhost:8888/customers/:cpf:/delete)**: Delete the customer specified.

