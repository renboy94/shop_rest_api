# Shop Rest Api

Simple shop rest api

## Setup

Clone the repo:

```
git clone git@github.com:renboy94/shop_rest_api.git
```

Install dependencies:

```
npm install
```

Create a .env file with these keys:

```
DB_USER=<username>
DB_PW=<password>
JWT_KEY=<secret>
```

## Tests

This project uses [Jest](https://jestjs.io/) as its test framework and [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) to spin up mongod in memory for fast tests. To run tests:

```
npm test
```
