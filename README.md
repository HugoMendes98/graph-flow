# Nx-NestJS-Angular

A boilerplate structure for a backend, frontend and back-office applications.

[![CI](https://github.com/HugoMendes98/Nx-NestJS-Angular/actions/workflows/ci.yml/badge.svg)](https://github.com/HugoMendes98/Nx-NestJS-Angular/actions/workflows/ci.yml)

| Code            | Jest coverage                                                                   |
|-----------------|---------------------------------------------------------------------------------|
| `libs/common`   | ![common-jest coverage](./.badges/libs/common/coverage-jest%20coverage.svg)     |
| `libs/ng`       | ![ng-jest coverage](./.badges/libs/ng/coverage-jest%20coverage.svg)             |
| `apps/backend`  | ![backend-jest coverage](./.badges/apps/backend/coverage-jest%20coverage.svg)   |
| `apps/frontend` | ![frontend-jest coverage](./.badges/apps/frontend/coverage-jest%20coverage.svg) |

| App             | Comment coverage                                                           |
|-----------------|----------------------------------------------------------------------------|
| `apps/backend`  | ![backend docs](./.badges/apps/backend/coverage-badge-documentation.svg)   |
| `apps/frontend` | ![frontend docs](./.badges/apps/frontend/coverage-badge-documentation.svg) |

## Description

This section should contain a description of the project.

As this is the base repository of the boilerplate,
all its "`README`" is available [here](./docs/nna.md).  
All other text are part of the boilerplate.

It can also use the [specifications file](./docs/specifications.md)
to more technically describe the project.

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
