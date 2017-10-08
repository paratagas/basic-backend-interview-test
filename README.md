# Node backend test
---

### Tech
Test case uses several open source projects to work properly and for tests:

* [Node.js] - JavaScript runtime built on Chrome's V8 JavaScript engine
* [Express.js] - Node.js web application framework
* [MongoDB] - NoSQL database
* [Grunt] - JavaScript task runner

---

### Requirements

* Tested successfully on [Node.js](https://nodejs.org/) v6.9+
* Tested successfully on [MongoDB](https://www.mongodb.com/) v2.6+

---

### Installation

* Download and extract the [latest version of Test](https://github.com/paratagas/basic-backend-interview-test)
* Install the dependencies and devDependencies:
```sh
$ cd node_backend_test
$ npm install
```

* To install dependencies for making tests run:
```sh
$ npm install -g grunt-cli
$ npm install -g mocha
$ npm install -g jshint
```

---

### Launching
```sh
$ npm start
```

After that your web application is available on:

```sh
http://localhost:4488
```

---

### Development

* To automatically start the server while development run:
```sh
$ nodemon
```

---

### Settings

App settings can be changed in "settings.js"

---

### Test tasks:

**NOTE:** I was free to use any framework I wish. Bonus points for an explanation of your choice.

1. Specify a default controller
  - for route `/`
  - with a proper json return `{"hello":"world!"}`

2. Use the api.nasa.gov
  - the API-KEY is `N7LkblDsc5aen05FJqBQ8wU4qSdmsftwJagVK7UD`
  - documentation: https://api.nasa.gov/neo/?api_key=N7LkblDsc5aen05FJqBQ8wU4qSdmsftwJagVK7UD

3. Write a command
  - to request the data from the last 3 days from nasa api
  - response contains count of Near-Earth Objects (NEOs)
  - persist the values in your DB
  - Define the model as follows:
    - date
    - reference (neo_reference_id)
    - name
    - speed (kilometers_per_hour)
    - is hazardous (is_potentially_hazardous_asteroid)

4. Create a route `/neo/hazardous`
  - display all DB entries which contain potentially hazardous asteroids
  - format JSON

5. Create a route `/neo/fastest?hazardous=(true|false)`
  - analyze all data
  - calculate and return the model of the fastest asteroid
  - with a hazardous parameter, where `true` means `is hazardous`
  - default hazardous value is `false`
  - format JSON

6. Create a route `/neo/best-year?hazardous=(true|false)`
  - analyze all data
  - calculate and return a year with most asteroids
  - with a hazardous parameter, where `true` means `is hazardous`
  - default hazardous value is `false`
  - format JSON

7. Create a route `/neo/best-month?hazardous=(true|false)`
  - analyze all data
  - calculate and return a month with most asteroids (not a month in a year)
  - with a hazardous parameter, where `true` means `is hazardous`
  - default hazardous value is `false`
  - format JSON

---

## Additional Instructions

- Tests are not optional
- Leave comments where you were not sure how to properly proceed.
- Implementations without a README will be automatically rejected.

---

## Bonus Points

- Clean code!
- Knowledge of application flow.
- Knowledge of modern best practices/coding patterns.
- Componential thinking.
- Knowledge of Docker.
- Usage of MongoDB as persistance storage.

---

### License

MIT

 [Node.js]: <https://nodejs.org/>
 [Express.js]: <http://expressjs.com/>
 [MongoDB]: <https://www.mongodb.com/>
 [Grunt]: <https://gruntjs.com/>