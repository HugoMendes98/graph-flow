# Nx-NestJS-Angular

`Nx-NestJS-Angular`, often abbreviated to `nna`, sometimes `Nx-Nest-Ng`,
is a boilerplate structure to provide a backend, a frontend and a back-office application.

This file and all others related to this one (`nna` directory)
are not part of any project and are only used to describe the boilerplate.

In these files, the use of `I`, `me`, `We` or `us`
refers to the author/contributor(s) of the `nna` boilerplate.
Unless they are used in a question, in which it means you, the reader.

The original URL of the repository is:  
<https://github.com/HugoMendes98/Nx-NestJS-Angular>

## Table of contents

<!-- TOC -->
* [Nx-NestJS-Angular](#nx-nestjs-angular)
  * [Purpose](#purpose)
  * [Can I use it?](#can-i-use-it)
  * [How to use it?](#how-to-use-it)
    * [Update the code](#update-the-code)
  * [TODOs](#todos)
  * [Contribution](#contribution)
<!-- TOC -->

## Purpose

This boilerplate purpose is to offer some base code when creating a new project.

`Nx-NestJS-Angular` aims to provide:

* A `backend` application:
  * with uniformed responses and filters
* A `frontend` and `office` application:
  * Communicating with the `backend` application
  * Translations ready to be added
* Tests:
  * Unit tests on all the libraries and applications
  * End-to-end testing to validate the whole applications
* Documented code
  * Comment `ESLint` rules
  * Comment coverage
* Code normalization:
  * `ESLint`, with `Prettier` and a bunch of rules
  * A default styleguide for all rules that `ESLint` can not enforce (yet)
* A default GitHub Action CI:
  * To validate all the previous elements
* Default documentation
  * Example: the styleguide
* A `Nx` plugin:
  * To generate some basic views
* Example code
  * `group` and `user` to more easily understand the application

It is far from perfect and
all the implementations, the styleguide, the `ESLint` rules, etc. are opinionated.  
Go to the [how to use](#how-to-use-it) for modifications.

> More features planned [here](#todos).

## Can I use it?

Yes, this whole repository is under a MIT license.
This basically means that you can use it for free.  
You can publicly say that you use this or
just keep the GibHub URL somewhere, just in case.

## How to use it?

The simpler way would be to fork this repository (even a _private_ fork).
But any way will work too; _download as a ZIP_, copy line by line, ...

Once you have access to the code:

* Remove, if necessary, the example chunks of code (`group` and `user`)
* Change, if wanted, the `ESLint` rules
* Complete, if needed, the documentation files

To summarise, the recovered code is all yours.
Try to keep the proposed standards or
completely change to your company ones or your personal tastes.

**Want to change a given function?**  
Change/update it.  
**The change could be part of the boilerplate?**  
See the [contribution](#contribution) section.

> We still recommend you to avoid any unnecessary changes to the _core_ code
> if you intend to keep it up to date.

### Update the code

Depending on how the code was recovered,
it could be, with a fork, a simple _pull from upstream_,
or a harder _pull from upstream_ with a lot of conflicts.

## TODOs

Check this [here](https://github.com/orgs/heap-code/projects/2) for what are the next steps of this boilerplate.

## Contribution

To contribute to this boilerplate, open a _pull request_.
There is no _pull request_ template (yet),
but it does need to provide a description of the changes/proposal/implementation.
