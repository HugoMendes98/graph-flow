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
    - [Lint](#lint)
      - [Run linters separately](#run-linters-separately)
    - [Test](#test)
      - [E2E tests](#e2e-tests)
    - [Compodoc](#compodoc)
    - [Storybook](#storybook)
  - [Code generation](#code-generation)
    - [Generate Angular files](#generate-angular-files)
      - [Generate views](#generate-views)
      - [Generate components](#generate-components)
    - [Create stories (Storybook)](#create-stories-storybook)
    - [I18n](#i18n)
      - [Extract I18n](#extract-i18n)
<!-- TOC -->

## Running commands

The _running_ commands run an instance of the application or another processus.

### Start

There is a command to run the `frontend` application in dev mode:

```bash
npm run frontend:start
```

> The server will be listening on the port `4200`.  
> Unless another port is set:
>
> ```bash
> npm run frontend:start -- --port 4202
> ```
>
> > <https://angular.io/cli/serve>

### Lint

As in the [lint section](../../../docs/commands.md#lint),
the application code can be linted with the following command:

```bash
npm run frontend:lint
```

And its corrector:

```bash
npm run frontend:lint:fix
```

> Check also the [styleguide](./styleguide.md).

#### Run linters separately

As for the [global linting](../../../docs/commands.md#lint),
it is possible to run each _linter_ separately

- _ESLint_:

```bash
npm run frontend:lint:code
```

And its corrector:

```bash
npm run frontend:lint:code:fix
```

- _Stylelint_:

```bash
npm run frontend:lint:style
```

And its corrector:

```bash
npm run frontend:lint:style:fix
```

### Test

As in the [test section](../../../docs/commands.md#test),
the library code can be tested with the following command:

```bash
npm run frontend:test
```

If developing at the same time, enable the watch mode:

```bash
npm run frontend:test:watch
```

#### E2E tests

See these [commands](../../frontend-e2e/docs/commands.md#tests) to run the E2E tests.

### Compodoc

[Compodoc](https://compodoc.app/) is a tool
that generates documentation from the comments of an `Angular` application.

The documentation can be served with the following command:

```bash
npm run frontend:compodoc
```

> The server will be listening on the port `4080`.

The documentation can also be generated to be served as static content:

```bash
npm run frontend:compodoc:build
```

The comment coverage can also be tested.
In fact, it is one of the tests of the CI:

```bash
npm run frontend:compodoc:coverage
```

### Storybook

[Storybook](https://storybook.js.org/) generates pages for the components of the application
in which it is possible to modifie their parameters and see them changing.

It can be run, in watch mode, with the following command:

```bash
npm run frontend:storybook
```

> The server will be listening on the port `4040`.

The content can also be compiled to be served statically:

```bash
npm run frontend:storybook:build
```

## Code generation

### Generate Angular files

The [Angular CLI](https://angular.io/cli) is a useful tool
that can be used via `Nx`.
The latest proposes a lot of commands,
especially the [generators](https://nx.dev/packages/angular/generators).

> Also see the [structure](./styleguide.md#structure) of the code.

#### Generate views

Views can be generated with the following command:

```bash
nx g @nna/plugin:view --project=frontend <view>
```

To generate a _dev_ view:

```bash
nx g @nna/plugin:view --project=frontend --dev <view>
```

> It uses the [plugin](../../../libs/plugin/docs/commands.md#generate-views) of the project.

#### Generate components

Components can be generated with the following command:

```bash
nx g @nx/angular:component --project=frontend components/<component>
```

To generate a _dev_ component:

```bash
nx g @nx/angular:component --project=frontend ../dev/components/<component>
```

### Create stories (Storybook)

To generate stories from the existing components:

```bash
npm run frontend:storybook:generate
```

### I18n

The following sections describe the commands related to **I18n**.

#### Extract I18n

The **I18n** keys can be extracted with the following command:

```bash
npm run frontend:i18n:extract
```
