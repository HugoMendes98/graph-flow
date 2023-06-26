# Commands

This file describes the commands
that can be run for e2e testing of the `office` application.

> /!\ The commands are run from the project's root directory.
>
> * Go [here](../README.md) to know more about this application tests.
> * Go [here](../../../docs/commands.md) to see more project commands.

## Table of contents

<!-- TOC -->
* [Commands](#commands)
  * [Tests](#tests)
<!-- TOC -->

## Tests

The application can be tested with the following command:

```bash
npm run office:e2e
```

If developing at the same time, enable the watch mode,
using the studio mode of `Cypress`:

```bash
npm run office:e2e:watch
```

> /!\ The watch mode only restarts the tests when **test code** is changed!  
> Not the application code.
