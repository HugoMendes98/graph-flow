# Changelog

## [0.4.1](https://github.com/HugoMendes98/graph-flow/compare/v0.4.0...v0.4.1) (2023-10-03)


### Bug Fixes

* **node/io:** restrict creation/update/deletion of node inputs/outputs ([6648bd3](https://github.com/HugoMendes98/graph-flow/commit/6648bd3b033e534edfc9082a29905e9ed5550170))

## [0.4.0](https://github.com/HugoMendes98/graph-flow/compare/v0.3.5...v0.4.0) (2023-10-02)


### Features

* **views/node:** list all `template` nodes ([18e3b3d](https://github.com/HugoMendes98/graph-flow/commit/18e3b3de5112ee33feb9ae7dcd62d940ba029e7e))
* **views/nodes:** add a node-list component with node-preview when expanded ([d1a5d99](https://github.com/HugoMendes98/graph-flow/commit/d1a5d9930d8cda156b8a37eb5b58e42fa2332067))
* **views/nodes:** can create a node template ([171bf3f](https://github.com/HugoMendes98/graph-flow/commit/171bf3f18ff0b9e97e333e959ae96e91df660063))

## [0.3.5](https://github.com/HugoMendes98/graph-flow/compare/v0.3.4...v0.3.5) (2023-10-01)


### Bug Fixes

* **node/io:** create inputs and outputs for `node-function` on parameters creation ([245f56f](https://github.com/HugoMendes98/graph-flow/commit/245f56f3c5070eb19a396161c21c9f49e4536a83))
* **node/io:** create inputs and outputs when creating a node ([1c75e51](https://github.com/HugoMendes98/graph-flow/commit/1c75e51213ce9bb995803a1b532480c14d364479))
* **node/io:** disable creation of `node-parameters` as template ([326d035](https://github.com/HugoMendes98/graph-flow/commit/326d0358b065979c8597d7f1d4ad082044260007))

## [0.3.4](https://github.com/HugoMendes98/graph-flow/compare/v0.3.3...v0.3.4) (2023-10-01)


### Code Refactors

* **e2e:** set e2e as detached processes ([77bb5ae](https://github.com/HugoMendes98/graph-flow/commit/77bb5aedd6d58e070059ded86886ab70091a9f3e))

## [0.3.3](https://github.com/HugoMendes98/graph-flow/compare/v0.3.2...v0.3.3) (2023-09-30)


### Bug Fixes

* **api/query:** correct implicit conversion ([5859ae4](https://github.com/HugoMendes98/graph-flow/commit/5859ae4c8d1943b11f6f2d25bf055d9c01c1b018))

## [0.3.2](https://github.com/HugoMendes98/graph-flow/compare/v0.3.1...v0.3.2) (2023-09-30)


### Bug Fixes

* **api/query:** add boolean filter + discrimnation of determined type (`{$eq: 1 }`) ([2890007](https://github.com/HugoMendes98/graph-flow/commit/2890007bac4ef28ea2f34598d658f2ed34ce4da8))

## [0.3.1](https://github.com/HugoMendes98/graph-flow/compare/v0.3.0...v0.3.1) (2023-09-29)


### Bug Fixes

* **api/query:** correct `order` and `where` for discriminated types ([3df2437](https://github.com/HugoMendes98/graph-flow/commit/3df2437de645addbee855dc5bced0522b5fb0b03))
* **api:** set back stricter query validation (no extraneous values) ([0c55926](https://github.com/HugoMendes98/graph-flow/commit/0c55926957be6fcf783e731287dc9b8a2c648544))

## [0.3.0](https://github.com/HugoMendes98/graph-flow/compare/v0.2.6...v0.3.0) (2023-09-27)


### Features

* **profile:** add a dialog allowing to change the names of the connected user ([f8667eb](https://github.com/HugoMendes98/graph-flow/commit/f8667ebacf2223beacb66d7519ae4207f4222c58))
* **views/workflows:** can create a workflow ([67c4ac9](https://github.com/HugoMendes98/graph-flow/commit/67c4ac9f9c996a011028c465cd85067ede2bf70f))
* **views/workflows:** list all workflows with `sort` "filter" ([c1eacde](https://github.com/HugoMendes98/graph-flow/commit/c1eacde38be3c16db71e5256d6c614a9e44bbe28))

## [0.2.6](https://github.com/HugoMendes98/graph-flow/compare/v0.2.5...v0.2.6) (2023-09-26)


### Bug Fixes

* **api:** add `Boolean` as an orderable property ([e5784fa](https://github.com/HugoMendes98/graph-flow/commit/e5784fabfe2ef7126cc17530a64b1ea6d4107d3e))

## [0.2.5](https://github.com/HugoMendes98/graph-flow/compare/v0.2.4...v0.2.5) (2023-09-24)


### Bug Fixes

* **node-behavior:** disable creation of node parameters from DTO ([0713436](https://github.com/HugoMendes98/graph-flow/commit/07134363acc526d84cde7cfe64a5cb4691f72d20))

## [0.2.4](https://github.com/HugoMendes98/graph-flow/compare/v0.2.3...v0.2.4) (2023-09-23)


### Bug Fixes

* **node-behavior:** correct partial nested for `node-behavior` ([5a6d201](https://github.com/HugoMendes98/graph-flow/commit/5a6d201ecd809982a2f454ebf5f2880b03d4df56))


### Code Refactors

* **node-behavior:** flatten "parameters" dto and entities ([f3edddd](https://github.com/HugoMendes98/graph-flow/commit/f3eddddd57d837b179faabf376a6eb556dec5ecf))

## [0.2.3](https://github.com/HugoMendes98/graph-flow/compare/v0.2.2...v0.2.3) (2023-09-22)


### Bug Fixes

* **http:** remove whitelist validation ([23b806c](https://github.com/HugoMendes98/graph-flow/commit/23b806c8d1b4d00368c0623770d5b9b53b618a66))
* **node-kind:** disallow node-kind type change ([0fe35a2](https://github.com/HugoMendes98/graph-flow/commit/0fe35a2a35ebae4dce270c2771136f6e21930ac0))
* **node:** correct nested discrimnated type (via `class-transformer`) ([70504d7](https://github.com/HugoMendes98/graph-flow/commit/70504d7c037d746df17e4c6839d09ec61a743926))


### Code Refactors

* remove enum type from barrel file ([ba46fa5](https://github.com/HugoMendes98/graph-flow/commit/ba46fa5f59ef6a0b9e27393ef79620ce3e11faaa))

## [0.2.2](https://github.com/HugoMendes98/graph-flow/compare/v0.2.1...v0.2.2) (2023-09-19)


### Bug Fixes

* **user:** forbid user update for other users ([414c83f](https://github.com/HugoMendes98/graph-flow/commit/414c83f5ef9753b23b62c5f945fe4832c46b0cae))

## [0.2.1](https://github.com/HugoMendes98/graph-flow/compare/v0.2.0...v0.2.1) (2023-09-17)


### Bug Fixes

* **graph-node:** correct missing validation decorators ([efab854](https://github.com/HugoMendes98/graph-flow/commit/efab8547c421ee72594a9ca569c89f2e3c0bc1e3))
* **http:** correct serialisation with validation ([44675ca](https://github.com/HugoMendes98/graph-flow/commit/44675cad604c88cdcff7ce4b141d0aca09384678))
* **node:** correct one2one entity save ([c3fd385](https://github.com/HugoMendes98/graph-flow/commit/c3fd385ec4f46c08d6f4724ba989f1167ece6d17))

## [0.2.0](https://github.com/HugoMendes98/graph-flow/compare/v0.1.0...v0.2.0) (2023-09-12)


### Features

* **executor:** add first graph and node executor ([a775def](https://github.com/HugoMendes98/graph-flow/commit/a775def56d2c5b0ecea65bbd93dddccc40b245ef))
* **executor:** execute node ([884765e](https://github.com/HugoMendes98/graph-flow/commit/884765e36d830e1a1da38349861f5f95bcd8f98a))


### Code Refactors

* add `Entity` suffix ([d51061f](https://github.com/HugoMendes98/graph-flow/commit/d51061f4280bbf94dcf0eb39029b378fe0d5aa81))
* remove `graph-node` to set inside a `node` ([2fb7a73](https://github.com/HugoMendes98/graph-flow/commit/2fb7a7329b640bca7b865357e81381e3aac8789c))

## [0.1.0](https://github.com/HugoMendes98/graph-flow/compare/v0.0.1...v0.1.0) (2023-09-07)


### Features

* **auth:** add snackBar when redirected ([f5de1f8](https://github.com/HugoMendes98/graph-flow/commit/f5de1f8190626f863ca082f8135832387ec9c384))
* **auth:** can login, redirect after login or be redirected to login if needed ([e7df474](https://github.com/HugoMendes98/graph-flow/commit/e7df47483bd963dc2c312a712debc158b22d74c8))
* **boiler:** add options to populate with an object ([da271dc](https://github.com/HugoMendes98/graph-flow/commit/da271dca819fe1c3c19165df0b2df12e97665079))
* **graph-arc:** can add or remove arcs ([bbf3ce2](https://github.com/HugoMendes98/graph-flow/commit/bbf3ce268f9414fd807908a06829fa3b97a1f0a7))
* **graph-arc:** verify input and output on a arc ([d44c91d](https://github.com/HugoMendes98/graph-flow/commit/d44c91d2192e6a15892100a4ce416279de19ab8d))
* **graph-node:** can add a node to a graph ([6e15869](https://github.com/HugoMendes98/graph-flow/commit/6e158692ef1d2e4d34468fbb740dddb34349d527))
* **graph-node:** verify that a workflow does not contain more than 2 `node-trigger`s ([780f189](https://github.com/HugoMendes98/graph-flow/commit/780f189f98b29e1688f2d908fdc53aaa04c3f66e))
* **graph-node:** verify that node `node-trigger` is added inside a `node-function` ([6bf3548](https://github.com/HugoMendes98/graph-flow/commit/6bf3548ac868898acac60687e16067e420286d0d))
* **graph:** add graph and graph-node entities ([b51f638](https://github.com/HugoMendes98/graph-flow/commit/b51f6387c52d044173d09b7e9be6168de2c32629))
* **graph:** detect cycle in graph ([6bf5f3b](https://github.com/HugoMendes98/graph-flow/commit/6bf5f3b6fab0d032e98b60954facc72399af55ea))
* **node:** add trigger type node ([c94fecb](https://github.com/HugoMendes98/graph-flow/commit/c94fecb3fa9be24ac0cf500d88df888afeec2647))


### Bug Fixes

* **graph-arc:** correct relation with input ([303347b](https://github.com/HugoMendes98/graph-flow/commit/303347bb31b13ff609ac50dce1569d9ce6e64a65))


### Documentation

* add a data diagram ([c01fa21](https://github.com/HugoMendes98/graph-flow/commit/c01fa219c4b737d8e9c6deb8ffea83eda6b0410b))

## 0.0.1 (2023-07-02)