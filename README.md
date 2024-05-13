# nodejs-api

## How to Run?

1. Install dependencies:

```bash
npm install
```

2. Run the server:

```bash
npm start
```

3. Run tests:

```bash
npm test
```

### Project Structure
```
|-- /node_modules
|-- /src
|   |-- /controllers
|   |-- /external-services
|   |-- /routes
|   |-- /middlewares
|   |-- /utils
|   `-- app.js
|-- /test
|   |-- /controllers
|   |-- /middlewares
|   |-- /utils
|-- .env
|-- .gitignore
|-- .nvmrc
|-- package.json
|-- README.md
|-- server.js
```

### Dependencies

* [dotenv](https://www.npmjs.com/package/dotenv): To manage environment variables in a centralized way and avoid coding them directly into your code.

```js
// app.js
require('dotenv').config()
```

* [express](https://www.npmjs.com/package/express): To build api server using express for managing route and middleware.

```js
const express = require('express');
const app = express();

// route
const router = express.Router();
router.get("/", (req, res, next) => res.send("Hello World"));
app.use('/test', router);

// middleware
app.use((error, req, res, next) => {
   console.log(error);
   res.status(error.status || 500).json({ message: error.message });
});

app.listen(5000, () => console.log(`App is listening on port 5000`));
```

* [node-fetch](https://www.npmjs.com/package/node-fetch): A light-weight module that brings window.fetch to Node.js.

```js
const fetch = require('node-fetch');

// http get request
const response = await fetch('https://api.github.com/users/github');
const json = await response.json();

// http post request
const response = await fetch('https://api.github.com/users/github', {
    method: 'POST',
    body: JSON.stringify({name: 'Hubot'})
});
const json = await response.json();
```

* [nodemon](https://www.npmjs.com/package/nodemon): Simple monitor script for use during development of a node.js app.

```
// package.json
{
   "scripts": {
     "watch": "nodemon app.js"
   }
}
```

* [jest](https://www.npmjs.com/package/jest): JavaScript Testing.

```
// package.json
{
   "scripts": {
     "test": "jest"
   }
}
```

* [node-mocks-http](https://www.npmjs.com/package/node-mocks-http): Mock 'http' objects for testing Express routes.

```js
const httpMocks = require('node-mocks-http');
const setupMockRequestResponse = () => {
   const req = httpMocks.createRequest();
   const res = httpMocks.createResponse();
   const next = jest.fn();
   return { req, res, next };
}
```

### When to write comments?

1. Express through the code itself, not through comments.
2. Comments can be added to a class or method to explain its purpose and the meaning of its parameters.

### What obstacles I met?

1. When considering error handling in TaskPool, since Promise.race() is used, it will immediately throw an error if a promise is rejected. Given the incomplete data, it is reasonable for the API to return an error, but it is also worth considering situations where it is necessary to continue execution despite failures.

2. Stuck writing controller tests until I discovered node-mocks-http, which allowed me to simulate HTTP requests and responses, and then proceed with the testing.
