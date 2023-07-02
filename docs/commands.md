# Commands

This file describes the commands that can be run with the project.

> To know more about this project, go [here](../README.md).

## Table of commands

<!-- TOC -->
* [Commands](#commands)
  * [Nx Commands](#nx-commands)
    * [Nx Lint](#nx-lint)
    * [Nx Graph](#nx-graph)
  * [NPM commands](#npm-commands)
    * [Lint](#lint)
    * [Test](#test)
    * [Comment coverage](#comment-coverage)
  * [Specific applications](#specific-applications)
<!-- TOC -->

## Nx Commands

This project uses `Nx` to manage the code.
It gives access to a lot of commands.

However, it is recommended to use [NPM commands](#npm-commands)
as they are manually added and confirmed.  
`Nx` can still be used.
In fact if a _running_ `Nx` command is really useful, it should probably be a NPM command too.

### Nx Lint

There are commands in `npm` to lint the code.
There is another one that be useful, if only some library or application code is modified:

```bash
nx lint
```

### Nx Graph

The graph dependencies of all the applications can be shown with the following command:

```bash
nx graph
```

## NPM commands

These commands are stored in the [package.json](../package.json) file
and mainly are shortcuts for `Nx` commands.

The real advantage is that, if a command exists in the file, then it can be run.
Developers do not need to know all the combination that `Nx` offers to run the principals commands.

### Lint

The _linter_ in this project also formats,
and it does for a lot of files:

* Typescript
* HTML
* SCSS
* JSON
* Markdown
* ...

There's 2 linters in the project:

* [ESLint](https://eslint.org/): does most of the job.
* [Stylelint](https://stylelint.io/): Very similar to _eslint_ but for stylesheet files (CSS, SCSS, ...).

There are 2 commands to run them both:

```bash
npm run lint
```

And its corrector:

```bash
npm run lint:fix
```

It is still possible to run them separately:

* _ESLint_:

```bash
npm run lint:code
```

And its corrector:

```bash
npm run lint:code:fix
```

* _Stylelint_:

```bash
npm run lint:style
```

And its corrector:

```bash
npm run lint:style:fix
```

> These commands are important but are not optimized.
> They test all the files from the root of this project.  
>
> If an application is modified, it is recommended to run the linter of that application
> or the [nx lint](#nx-lint).

### Test

It is possible to run the tests of this project with 2 commands.

The first one runs the unit tests:

```bash
npm run test
```

And another for the e2e tests:

```bash
npm run test:e2e
```

> Go [here](./flow-testing.md#e2e-testing) to know more about the tests.

These commands are not made to be developed with;
It has no _watch_ mode.

### Comment coverage

[Compodoc](https://compodoc.app/) is a tool that generates documentation.
It can also test if the comments have enough coverage in the project:

```bash
npm run compodoc:coverage
```

## Specific applications

Check the following files for their specific commands.

* Libraries
  * `common`: see [commands](../libs/common/docs/commands.md).
  * `ng`: see [commands](../libs/ng/docs/commands.md).
  * `plugin`: see [commands](../libs/plugin/docs/commands.md).
* Application
  * `backend`: see [commands](../apps/backend/docs/commands.md).
  * `frontend`: see [commands](../apps/frontend/docs/commands.md).
