# GraphFlow

Create, modify and execute workflows by editing graphs.

[![CI](https://github.com/HugoMendes98/graph-flow/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/HugoMendes98/graph-flow/actions/workflows/ci.yml?query=branch%3Amaster)

| Code            | Jest coverage                                                        |
|-----------------|----------------------------------------------------------------------|
| `libs/common`   | ![common-jest coverage](./.badges/libs/common/code/coverage.svg)     |
| `libs/ng`       | ![ng-jest coverage](./.badges/libs/ng/code/coverage.svg)             |
| `apps/backend`  | ![backend-jest coverage](./.badges/apps/backend/code/coverage.svg)   |
| `apps/frontend` | ![frontend-jest coverage](./.badges/apps/frontend/code/coverage.svg) |

> **Note**:  
> There are e2e tests, so the coverage for `ng` and `frontend` is not very representative.

| App             | Comment coverage                                               |
|-----------------|----------------------------------------------------------------|
| `apps/backend`  | ![backend docs](./.badges/apps/backend/comment/coverage.svg)   |
| `apps/frontend` | ![frontend docs](./.badges/apps/frontend/comment/coverage.svg) |

## Description

The purpose of `GraphFlow` is to be able to create workflows by editing graphs.  

The graphs are composed of nodes that can be created and reused by many workflows.
The nodes can be simple variables, execute some custom code or even be functions
that themselves consist of a graph.

### Context

This work was carried out as a final project for the 2023 bachelor's degree.

## Requirements

To make this project working,
the following conditions are required:

- [NodeJS](https://nodejs.org/en) (>= 16)
- [npm](https://www.npmjs.com/)

### Dev tools

- [docker](https://www.docker.com/) (optional)

## Usage

Some commands to quickly run the code:

> See all the other [commands](./docs/commands.md).

### Install

Install the node packages:

```bash
npm install
```

### Run the `backend`

Start a database:

```bash
docker-compose up db
```

Then run the `backend`:

```bash
npm run backend:start
```

> See more `backend` [commands](./apps/backend/docs/commands.md).

#### Init and populate the database

To init the database and add some default data:

```bash
npx mikro-orm schema:fresh -r --seed DbBaseSeeder
```

> This completely resets the database.
> All existing data is lost.

### Run the `frontend`

```bash
npm run frontend:start
```

> See more `frontend` [commands](./apps/frontend/docs/commands.md).

### Tests

To run the tests:

```bash
npm run test
```

To run the `e2e` tests:

```bash
npm run test:e2e
```

> See more global [commands](./docs/commands.md#test).

## Contribution

See the [git flow](./docs/flow-git.md) to contribute.
