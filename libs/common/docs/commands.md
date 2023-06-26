# Commands

This file describes the commands that can be run for this library.

> /!\ The commands are run from the project's root directory.
>
> * Go [here](../README.md) to know more about the library.
> * Go [here](../../../docs/commands.md) to see more project commands.

## Table of contents

<!-- TOC -->
* [Commands](#commands)
  * [Lint](#lint)
  * [Test](#test)
<!-- TOC -->

## Lint

As in the [lint section](../../../docs/commands.md#lint),
the library code can be linted with the following command:

```bash
npm run libs:common:lint
```

And its corrector:

```bash
npm run libs:common:lint:fix
```

> Check also the [styleguide](./styleguide.md).

## Test

As in the [test section](../../../docs/commands.md#test),
the library code can be tested with the following command:

```bash
npm run libs:common:test
```

If developing at the same time, enable the watch mode:

```bash
npm run libs:common:test:watch
```
