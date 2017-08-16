[![Build Status](https://secure.travis-ci.org/rjmreis/hapi-api.svg)](http://travis-ci.org/rjmreis/hapi-api)
[![Dependencies Status](https://david-dm.org/rjmreis/hapi-api.svg)](https://david-dm.org/rjmreis/hapi-api)
[![DevDependencies Status](https://david-dm.org/rjmreis/hapi-api/dev-status.svg)](https://david-dm.org/rjmreis/hapi-api#info=devDependencies)

# hapi-api
本项目基于hapi-api

## The Goal
实现node.js来编写API，实践全栈式撸代码

## Core Stack

- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Hapi** - [http://hapijs.com/](http://hapijs.com/)

## Quick Start

Clone project and install dependencies:
```bash
$ git clone https://git.oschina.net/davemayun/report-hapi.git
$ cd report-hapi
$ npm install
```

Start the server:
```bash
$ npm start -s
```

Run tests:
```bash
$ npm test
```

## Plugins

- **glue** - Server composer for hapi.js.
https://github.com/hapijs/glue
- **hapi-auth-jwt2** - Secure Hapi.js authentication plugin using JSON Web Tokens (JWT) in Headers, Query or Cookies.
https://github.com/dwyl/hapi-auth-jwt2
- **blipp** - Simple hapi plugin to display the routes table at startup.
https://github.com/danielb2/blipp
- **good** - Hapi process monitor. It listens for events emitted by Hapi Server instances and allows custom reporters to be registered that output subscribed events.
https://github.com/hapijs/good
- **good-console** - Console reporting for Good process monitor.
https://github.com/hapijs/good-console
- **good-squeeze** - Simple transform stream for event filtering with good.
https://github.com/hapijs/good-squeeze
- **lab** - Node test utility.
https://github.com/hapijs/lab
- **code** - BDD assertion library.
https://github.com/hapijs/code
- **nodemon** - Monitor for any changes in your node.js application and automatically restart the server.
https://github.com/remy/nodemon
- **eslint** - A fully pluggable tool for identifying and reporting on patterns in JavaScript.
https://github.com/eslint/eslint
- **eslint-plugin-import** - ESLint plugin with rules that help validate proper imports.
https://github.com/benmosher/eslint-plugin-import
- **npm-run-all** - A CLI tool to run multiple npm-scripts in parallel or sequential.
https://github.com/mysticatea/npm-run-all

## Project Structure
```
.
├── api/
|   ├── handlers/
|   |   └── home.js   * Sample handler
|   └── index.js      * REST routes
├── config/
|   ├── manifest.js   * Server configuration
|   └── secret.js     * Secret key
├── test/
|   └── api.js        * API test
├── server.js         * Server definition (uses the Glue plugin to read a manifest)
├── auth.js           * Auth strategies
└── package.json
```

## License
Copyright (c) 2017 Dave