# Commands

This file describes the commands that can be run for this library.

> /!\ The commands are run from the project's root directory.
>
> - Go [here](../README.md) to know more about the library.
> - Go [here](../../../docs/commands.md) to see more project commands.

## Table of contents

<!-- TOC -->
- [Commands](#commands)
  - [Running commands](#running-commands)
    - [Lint](#lint)
    - [Test](#test)
  - [Code generation](#code-generation)
    - [Generate Angular files](#generate-angular-files)
      - [Generate modules](#generate-modules)
      - [Generate services](#generate-services)
      - [Generate components](#generate-components)
    - [I18n](#i18n)
<!-- TOC -->

## Running commands

The _running_ commands lint of test the library code.

### Lint

As in the [lint section](../../../docs/commands.md#lint),
the library code can be linted with the following command:

```bash
npm run libs:ng:lint
```

And its corrector:

```bash
npm run libs:ng:lint:fix
```

> Check also the [styleguide](./styleguide.md).

### Test

As in the [test section](../../../docs/commands.md#test),
the library code can be tested with the following command:

```bash
npm run libs:ng:test
```

If developing at the same time, enable the watch mode:

```bash
npm run libs:ng:test:watch
```

## Code generation

### Generate Angular files

The [Angular CLI](https://angular.io/cli) is a useful tool
that can be used via `Nx`.
The latest proposes a lot of commands,
especially the [generators](https://nx.dev/packages/angular/generators).

#### Generate modules

Modules can be generated with the following command:

```bash
nx g @nx/angular:module --project=ng <module>
```

#### Generate services

Services can be generated with the following command:

```bash
nx g @nx/angular:service --project=ng <service>
```

#### Generate components

Components can be generated with the following command:

```bash
nx g @nx/angular:component --project=ng <component>
```

### I18n

The following sections describe the commands related to **I18n**.

#### Extract I18n

The **I18n** keys can be extracted with the following command:

```bash
npm run libs:ng:i18n:extract
```
