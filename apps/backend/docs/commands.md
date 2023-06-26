# Commands

This file describes the commands that can be run for this application.

> /!\ The commands are run from the project's root directory.
>
> - Go [here](../README.md) to know more about the library.
> - Go [here](../../../docs/commands.md) to see more project commands.

## Table of contents

<!-- TOC -->
- [Commands](#commands)
  - [Running commands](#running-commands)
    - [Start](#start)
      - [Running Database](#running-database)
    - [Lint](#lint)
    - [Test](#test)
      - [E2E tests](#e2e-tests)
    - [Compodoc](#compodoc)
    - [Run Mikro-orm](#run-mikro-orm)
      - [Run Migrations](#run-migrations)
    - [Schema Generator](#schema-generator)
    - [Seeding](#seeding)
  - [Code generation](#code-generation)
    - [Generate Nest component](#generate-nest-component)
      - [Generate modules](#generate-modules)
      - [Generate services](#generate-services)
      - [Generate controllers](#generate-controllers)
    - [Generate Mikro-orm](#generate-mikro-orm)
      - [Create Mikro-orm Migration](#create-mikro-orm-migration)
<!-- TOC -->

## Running commands

The _running_ commands run an instance of the application or another processus.

### Start

There is a command to run the `backend` application:

```bash
npm run backend:start
```

> The server will be listening on the port `3000`.  
> Unless the [configuration](../src/config.ts) has been changed.

#### Running Database

It is possible to launch a Database instance with the given [docker-compose.yml](../../../docker-compose.yml).

```bash
docker-compose up db
```

### Lint

As in the [lint section](../../../docs/commands.md#lint),
the application code can be linted with the following command:

```bash
npm run backend:lint
```

And its corrector:

```bash
npm run backend:lint:fix
```

> Check also the [styleguide](./styleguide.md).

### Test

As in the [test section](../../../docs/commands.md#test),
the library code can be tested with the following command:

```bash
npm run backend:test
```

If developing at the same time, enable the watch mode:

```bash
npm run backend:test:watch
```

#### E2E tests

See these [commands](../../backend-e2e/docs/commands.md#tests) to run the E2E tests.

### Compodoc

[Compodoc](https://compodoc.app/) is a tool
that generates documentation from the comments of an `Angular` application.
`Nest` having a file structure very similar, it works on it too

> <https://docs.nestjs.com/recipes/documentation>

The documentation can be served with the following command:

```bash
npm run backend:compodoc
```

> The server will be listening on the port `3080`.

The documentation can also be generated to be served as static content:

```bash
npm run backend:compodoc:build
```

The comment coverage can also be tested.
In fact, it is one of the tests of the CI:

```bash
npm run backend:compodoc:coverage
```

### Run Mikro-orm

`Mikro-orm` is the orm managing connection and all the queries with the database.

The following commands need a running database
which the configuration is set in the [config file](../src/config.ts).

> **/!\ Be aware that all the following commands modify the database.**

#### Run Migrations

The migrations update the database schema
and eventually its data.

The migrations can be run with the following command:

```bash
npx mikro-orm migration:up
```

It can also be reverse a step with the command:

```bash
npx mikro-orm migration:down
```

> More commands at <https://mikro-orm.io/docs/migrations#using-via-cli>.

### Schema Generator

It is possible to generate the schema for the database.

The command will drop, then recreate the database schema:

```bash
npx mikro-orm schema:fresh -r
```

To completely remove the schema, use the next command:

```bash
npx mikro-orm schema:drop -r --drop-migrations-table
```

> More commands at <https://mikro-orm.io/docs/schema-generator>.

### Seeding

The _seeding_ consists of inserting some data in the database,
instead of adding them manually.

The command is as follows (on a up-to-date database):

```bash
npx mikro-orm seeder:run -c <seed>
```

> The possible values for `<seed>` are:
>
> - `DbBaseSeeder`: Some basic data

It is also possible to recreate all the database schema
and seed it with the following command:

```bash
npx mikro-orm schema:fresh -r --seed <seed>
```

> More commands at <https://mikro-orm.io/docs/seeding#use-with-cli>.

## Code generation

These commands generate some chunk of code for the application.
They are well integrated in the project and does the necessary changes.

### Generate Nest component

The [Nest CLI](https://docs.nestjs.com/cli/overview) is a useful tool
that can be used via `Nx`.
The latest proposes a lot of commands,
especially the [generators](https://nx.dev/packages/nest/generators).

> Also see the [structure](./styleguide.md#structure) of the code.

#### Generate modules

Here's the command to generate an application module:

```bash
nx g @nx/nest:module --project=backend app/<module>
```

Where `<module>` is the module to create.

---

To generate a non-application module (for example, `orm`):

```bash
nx g @nx/nest:module --project=backend orm
```

#### Generate services

Here's the command to generate an application service:

```bash
nx g @nx/nest:service --project=backend app/<service>
```

Where `<service>` is the service to create.

---

To generate a non-application service (for example, `orm`):

```bash
nx g @nx/nest:service --project=backend orm
```

---

If another service must be created to an existing module,
the `--flat` parameter must be provided.

Example with a secondary service for a `group` module:

```bash
nx g @nx/nest:service --project=backend app/group/groupWithRoles --flat
```

The final results would look like:

- `group.module.ts`
- `group-with-roles.servive.ts`
- `group.servive.ts`

#### Generate controllers

Here's the command to generate an application controller:

```bash
nx g @nx/nest:controller --project=backend app/<controller>
```

Where `<controller>` is the controller to create.

---

To generate a non-application controller (for example, `orm`):

```bash
nx g @nx/nest:controller --project=backend orm
```

---

If another controller must be created to an existing module,
the `--flat` parameter must be provided.

Example with a secondary controller for a `group` module:

```bash
nx g @nx/nest:controller --project=backend app/group/groupWithRoles --flat
```

The final results would look like:

- `group-with-roles.controller.ts`
- `group.controller.ts`
- `group.module.ts`

### Generate Mikro-orm

The following sections are commands that generate some chunk of code
that can later be run into a database.

#### Create Mikro-orm Migration

It is possible to create migrations files with the CLI.

The following command generates a migration file:

```bash
npx mikro-orm migration:create
```

> `Mikro-orm` determines the changes from the snapshot to generate the file.  
> Check [here](./styleguide.md#mikro-orm-migrations) after the creation of a migration.

To have a blank migration file, use the next command:

```bash
npx mikro-orm migration:create -b
```

> More commands at <https://mikro-orm.io/docs/migrations#using-via-cli>.
