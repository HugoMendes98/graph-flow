# TODOs

This is a list of possible features, changes, improvements for the boilerplate.

## Table of contents

<!-- TOC -->
* [TODOs](#todos)
  * [Criteria](#criteria)
  * [Features](#features)
    * [class-transformer on frontend](#class-transformer-on-frontend)
    * [Protobuf encoding](#protobuf-encoding)
    * [Authentification (JWT) example](#authentification-jwt-example)
    * [Complete example given specifications](#complete-example-given-specifications)
    * [Re-use the HTTP query en/de-code?](#re-use-the-http-query-ende-code)
    * [Swagger documentation for query filters](#swagger-documentation-for-query-filters)
    * [Error codes](#error-codes)
    * [Be able to run with MariaDB (or other)](#be-able-to-run-with-mariadb-or-other)
    * [API versioning](#api-versioning)
    * [Rethink the frontend structure](#rethink-the-frontend-structure)
    * [Test storybook on `ng` components](#test-storybook-on-ng-components)
    * [Translation keys merging](#translation-keys-merging)
    * [Complete documentation](#complete-documentation)
    * [Compodoc markdown links](#compodoc-markdown-links)
    * [(Admin) components or views generator](#admin-components-or-views-generator)
    * [E2e testing with Cypress and storybook](#e2e-testing-with-cypress-and-storybook)
    * [Add more E2E test examples](#add-more-e2e-test-examples)
    * [Move this file content to GitHub](#move-this-file-content-to-github)
    * [PR/Issue templates](#prissue-templates)
    * [Create app and change Nx accessToken](#create-app-and-change-nx-accesstoken)
    * [Auto-versioning and auto-changelog](#auto-versioning-and-auto-changelog)
    * [Docker tools + doc](#docker-tools--doc)
    * [Websocket/Server-side-event subscription system](#websocketserver-side-event-subscription-system)
    * [SSR for frontend application](#ssr-for-frontend-application)
    * [Create or find some ESLint rules](#create-or-find-some-eslint-rules)
    * [Grammar, Spelling review](#grammar-spelling-review)
    * [A logo?](#a-logo)
  * [Note about the priority](#note-about-the-priority)
<!-- TOC -->

## Criteria

The features are evaluated according to 2 criteria:

* Significance: How much value the completed feature will bring to the project.
* Priority: More the likeliness of being completed first.

All these criteria go from to `0` to `3`, `3` being the higher.

> The difficulty is not considered as a criteria in the feature's definition.

## Features

All modifications are considered as features.  
All of them are subjectively evaluated.

### class-transformer on frontend

* Significance: 2
* Priority: 3

The current API clients use the JSONified types of the DTOs.
This feature's purpose is to use class-transformer
to have the DTO "natural" type, to be use them directly in the frontend code.

**Tasks**:

* "Remove" the remaining `swagger` decorators
  * The `nest swagger` plugin is already set,
  but some decorators are still present for generated classes (ResultsDTO for instance)
  * It does not necessary need to be removed, it can be "webpack ignored"
* Add, in the API services, abstract functions or properties to recover the get-one and find-many DTOs
  * Transform the response data with these classes

> This also aims to be able to use the DTO validations on frontend.

### Protobuf encoding

* Significance: 1
* Priority: 2

With the help of the `DtoProperty` decorator,
be able to generate the protobuf schema,
at least when reading data.  

It is not a necessary feature,
but can help to optimize the time of the requests when a lot of data is required.

**Tasks**:

* Do [class-transformer on frontend](#class-transformer-on-frontend) first
* Be able to generate the schemas
  * From a DTO class
  * Use of <https://www.npmjs.com/package/protobufjs>?
* Manage the content-encoding
  * The API client can ask for _protobuf_ encoding (`accept` header).
    * If the _protobuf_ schema is available for the client.
  * If the backend is not able to return protobuf content, it fallbacks to JSON.
    * The API client determines the content received (`content-type` header) and decodes it.
  * _Protobuf_ encoding is enabled by default in PROD build but not in dev ones.

### Authentification (JWT) example

* Significance: 3
* Priority: 2

The current example code does not provide any authentification.  
It should be implemented with the most commonly used standard: JWT.

The example should also pretty strong,
with refresh tokens and middlewares in the frontend applications.

**Tasks**:

* It should be possible to configure the JWT
  * Security passphrase
  * Access token time
  * Refresh token time
* An option to add it as a Cookie?
  * The `backend` will still be stateless, but will also look in the cookies for authentification
  * It avoids too much manipulation in the frontend applications
  * Can more easily serve protected files from the `backend` (as the cookies are always send)

### Complete example given specifications

* Significance: 2
* Priority: 2

The specification example should, at least,
be reflected in the example code.

**Tasks**:

* Implement missing parts

### Re-use the HTTP query en/de-code?

* Significance: 2
* Priority: 1

In this [directory](../../libs/common/src/http/query),
there is code that is not used anywhere in the applicatif code.  
They are functions that encode and decode query parameters from url to ensure their type.

For example, a number becomes a string in a query parameters.
The `encode` function adds a hidden char before the value,
so the `decode` function knows that the real type is a number.

Currently, _`class-transformer` implicit conversion_ is used for query params.
It has been set to be able to write the requests easily on the browser or with `cURL`.

However, it removes the value too easily when the expected type is wrong.
It can lead to filters wrongly applied.

> **Example**:  
> Given the requests: `/myurl?myArray[myInt]=3`  
> And the following DTOs used for query parameters.
>
> ```typescript
> class MyArrayDto {
>   @IsNumber()
>   public myInt!: number;
> }
> 
> class MyDto {
>   @Type(() => MyArrayDto)
>   public myArray!: MyArrayDto[];
> }
> ```
>
> `class-transformer` will completely ignore the `myArray` parameter.

**Tasks**:

* Add a header that disallows the _implicit conversion_ and uses the query encoder/decoder?
  * For the API services
  * Still allow to use other tools to write the requests.
* Use the [decoder](../../libs/common/src/http/query/http-query.decode.ts)
on an interceptor on the backend for GET requests.
* Use the [encoder](../../libs/common/src/http/query/http-query.encode.ts)
before a GET request in the API services.

### Swagger documentation for query filters

* Significance: 1
* Priority: 1

Currently, the query schema for filtering data is too complex to
be shown in the Swagger API documentation.

**Tasks**:

* Be able to show, in any way, the expected filters

### Error codes

* Significance: 2
* Priority: 2

The HTTP status code is not always enough to provide error, especially on modifications.

**Example**:  
When changing the `creator` of a group, with a request like:

```json
{
  "body": { "__creator": 10 },
  "url": "/groups/4"
}
```

We could receive a _HTTP 404 Not found_ response.  
But it does not define if it was the group being updated that was not found or the user being set.

The objective of this feature is to provide more information with errors,
by returning another code or even a possible translation key.

**Proposal**:  
Extend and normalize the messages returned by class-validator
by adding a string code in the errors that could also be used as a translation key.

* For the given example:

```json
{
  "errors": [
    {
      "code": "relation.not-found", 
      "params": {},
      "property": "__creator"
    }
  ],
  "message": "The ressource ('User not found ({ _id: 10 })') was not found.",
  "statusCode": 404
}
```

* Validation error, given a user with the possible DTO:

```typescript
class UserNameDto {
  @MinLength(2)
  public first!: string;
  @MaxLength(20)
  public last!: string;
}

class UserDto {
  @Between(new Date(2000, 1, 1), new Date(2100, 1, 1))
  public date!: Date;
 @Length(3, 10)
  public names!: UserNameDto[];
}
```

It could return in case of error:

```json
{
  "errors": [
    {
      "code": "validation.date-between",
      "params": {
        "max": "2100-01-01T12:00:00.00Z",
        "min": "2000-01-01T12:00:00.00Z"
      },
      "property": "date"
    },
    {
      "code": "validation.min-length",
      "params": {
        "min-length": 2
      },
      "property": "names[0].first"
    },
    {
      "code": "validation.max-length",
      "params": {
        "max-length": 20
      },
      "property": "names[1].last"
    },
    {
      "code": "validation.array-length",
      "params": {
         "max": 10,
         "min": 3
      },
      "property": "names"
    }
  ],
  "message": "The payload is incorrect",
  "statusCode": 400
}
```

**Tasks**:

* a

### Be able to run with MariaDB (or other)

* Significance: 2
* Priority: 1

`Mikro-orm` allows to use many database system.
Even if _PostgresSQL_ is the default one for this boilerplate,
It is useful to use another one, when an already existing database must be used.

The priority is not that high as this change can be easily for any project.

**Tasks**:

* Be able to define the system from the configuration
* Be able to run the tests with different systems
  * For example, if a project should work with _PostgresSQL_ and _MariaDB_,
  it should be possible to run the tests with either.
  * A CI should probably also only pass if both succeed.

### API versioning

* Significance: 1
* Priority: 1

The current versioning method for the API endpoints is pretty basic and possibly not optimized.

**Tasks**:

* Find something better?

### Rethink the frontend structure

* Significance: 3
* Priority: 2

**I** am not completely satisfied with current structure of the frontend applications.  
I do not think necessary to overuse modules when implementing an application,
especially for components from different domains that can be used in one or another.

**Tasks**:

* Rethink the structure, some points:
  * No cyclic module dependencies **with components**.
    * _Angular_ can manage cyclic dependencies, but not when they are from the components.
  * The `views` structure should stay as they are the closest to a "page".
    * `views` as modules?
    * I think the components directory should be in a sub-folder

> All this comes to the possibility of adding another services/pipe/directive in an application.
> **Example**:  
> A `UserService` is created.  
> Its purpose is more or less to be wrapper of the `UserAPIService` that keeps the user connected.  
> **Where should the file be stored?**

### Test storybook on `ng` components

* Significance: 1
* Priority: 1

Storybook helps to develop components, but it has not been tested if it manages `ng` components.

**Tasks**:

* Add a components in the `ng` library
  * Does it appear on the storybooks of the applications?
* Run the storybook only from the `ng` library?

### Translation keys merging

* Significance: 2
* Priority: 1

There is a translation file for the `ng` library and the frontend applications.
The merge of the frontend over the `ng` one works.  
However, the i18n extractor will probably not find that a key is already defined elsewhere
and will then duplicate the key.

**Tasks**:

* Completely change this system?
  * Remove the translation from the `ng` library?
    * Force the set the strings from the implementation
    * No shared translation between `frontend` and `office`
* All `ng` translation must be prefixed and can not be used in the application codes?

### Complete documentation

* Significance: 2
* Priority: 2

In par with [frontend structure rethinking](#rethink-the-frontend-structure),
the frontend documentations are partially finished.

**Tasks**:

* Finishing the previous features would probably help.
* Complete any incomplete files (especially the `README`s)

### Compodoc markdown links

* Significance: 1
* Priority: 1

`Compodoc` allows to serve markdown files,
but the links to another files will only redirect to non-existing files.

**Tasks**:

* Find a solution

### (Admin) components or views generator

* Significance: 3
* Priority: 1

As the backend and frontend API services are known from the plugin,
some views and components could be generated for a ressource to allow to read and edit them.

This aims more for creating the back-office applications.
This will generate code, more than extending default components,
so the generated components can easily be customized.

**Tasks**:

* Be able to analyze the endpoints with the services, the DTOs, the entities, ...
* Generate some components
  * A list view, with the ability to filter, sort and paginate
    * Can also select the ressources to apply an action to many of them
  * An item view
    * That allows viewing, editing and deleting
    * Via the entity, also manage the relations
  * Be able to create a ressource

### E2e testing with Cypress and storybook

* Significance: 1
* Priority: 0

It is possible to generate cypress test alongside the storybook files for components.

However, the default `e2e` testing and unit tests for frontend application seems enough.

**Tasks**:

* Create a new e2e testing application for stories

### Add more E2E test examples

* Significance: 2
* Priority: 1

The current example are pretty weak for e2e testing.

**Tasks**:

* Add tests following the styleguide

### Move this file content to GitHub

* Significance: 1
* Priority: 0

Its priority (and significance) is determined by the popularity of this boilerplate:  
If more people are interested, it will probably be more effective
to add all these enumerated features in a GitHub project tools instead of checking this file.

**Tasks**:

* Move/copy the features in the tool
* Delete this file

### PR/Issue templates

* Significance: 1
* Priority: 0

Very similar to the previous one.

**Tasks**:

* Define the templates

### Create app and change Nx accessToken

* Significance: 2
* Priority: 1

It could be a problem to keep the same `Nx accessToken`.
There should, at least, have documentation for it.

It could also be easier to have a command line that create an app.

> Like `Nest` does with `nest new project-name`  
> <https://docs.nestjs.com/first-steps>

**Tasks**:

* Update the [nna](../nna) file.
  * Changes to make
* Be able to create a NNA app?

### Auto-versioning and auto-changelog

* Significance: 2
* Priority: 1

Even if this boilerplate aims to be used for final products,
in which the changelog and the versioning are not often use.
It still can be used for both the boilerplate and the product:  
If someone wants to keep the core code up-to-date (see [here](../nna.md#update-the-code)),
he could simply check this boilerplate version and see the changelog.  
In a product, it could also help to determine when the changes are made in the project.

**Tasks**:

* This detections should be determined from the `develop` or `master` branch
  * From a _pull request_?
* In a first step, the `patch` and `minor` release will be automated,
but the `major` release will still be a "manual" operation
  * Given these definitions: <https://docs.npmjs.com/about-semantic-versioning>

### Docker tools + doc

* Significance: 1
* Priority: 1

Docker is currently only used to start a DB instance.
It should provide more services if someone's computer does not have the requirements.

Plus, the documentation can also be better with a
"How to structure docker related files" section for instance.

These default configurations will firstly aim to help developing.

**Tasks**:

* In the docker-compose:
  * A `backend` service
    * Listening to a port and in watch mode with a volume binding
  * A `frontend` service
    * Listening to a port and in watch mode with a volume binding
  * A `office` service
    * Same as `frontend`
* Documentations for:
  * The previously mentioned services
  * How to structure the files
  * Also be able to run the tests through a docker command
    * With the docker-compose services or a simple `docker run` command

### Websocket/Server-side-event subscription system

* Significance: 1
* Priority: 1

Depending on the project, a more reactive application is needed.

This system aims to a subscription system in which the frontend can decide
if the update/deletion of a current viewing item should be notified,
Or even on the creation of a new one.

This has already been done on a personal project with [sockets](https://docs.nestjs.com/websockets/gateways),
but it can easily be done with SSE as only the server will notify the changes.  
Writing through this _second canal_ is not necessary, as the frontend can still make HTTP requests.

**Tasks**:

* Determine on the use of sockets or SSE
  * SSE could be simpler but sockets allow more expansion.
* If sockets are chosen
  * Be able to throw errors and to be caught in the frontend code
    * The gateways from `Nest` send the errors via another socket event
* On any case:
  * Aim to a frontend code similar to the example below
    * The unsubscription of the observables (or similar) should close the active connection
    * Do not return the whole object but only the id to make a HTTP request instead
  * A light authentication system:
    * Avoid an unauthorized user to listen to resources he can not get
      * Not necessary if a HTTP request is needed?

---

How the client code could look like:

```typescript
@Injectable()
export class GroupSocket { // Or SSE
  /**
   * Be notifed when a new `group` is created
   */
  public onCreate(): Observable<number>;
  /**
   * Be notifed when the given group ids are updated
   */
  public onUpdate(ids: number[]): Observable<number>;
  /**
   * Be notifed when the given group ids are deleted
   */
  public onDelete(ids: number[]): Observable<number>;
}
```

### SSR for frontend application

* Significance: 1
* Priority: 1

I do not think that SSR is often needed as the modern web crawlers can run javascript.  
However, it can still be useful for mobile devices, caching or any other reasons

> <https://angular.io/guide/universal#why-use-server-side-rendering>

[Angular universal](https://angular.io/guide/universal) can pretty simply installed via `Nx`.

**Tasks**:

* Follow <https://nx.dev/packages/angular/generators/setup-ssr>
* Special interceptor for SSR requests on pre-rendering?

> It will probably only be set for the `frontend` application
> as it is the one that is more likely be publicly shared.

### Create or find some ESLint rules

* Significance: 1
* Priority: 1

The styleguide is only a document and some of its rules can be forgotten.
It is far easier to respect a rule if it is defined via a tool like `ESLint`.

Let's first concentrate on a few rules:

* [Decorators ordering](../styleguide.md#decorators)
* [Exported types](../styleguide/typescript.md#when-to-export-interfaces-or-types)
* [Destructuring in parameters](../styleguide/typescript.md#destructuring)
* [Table of contents](../styleguide/documentation.md#toc)

**Tasks**:

* Find if a rule/plugin already exists
* If not, create one
  * Not necessary in this repository,
  it could be a regular `ESLint` plugin used by anyone

### Grammar, Spelling review

* Significance: 1
* Priority: 1

I consider myself average in english,
that means that some errors are probably present in the documentation.  
And even if I avoided any confusing sentence, some may have no sense.

**Tasks**:

* Check any spelling errors
* Check any grammar errors
* Use prettier sentences?
  * Do not completely change the meaning of a sentence though.  
  The reading of a technical documentation can be boring when a lot of same words are use,
  but it assures to always describe the same thing.

### A logo?

* Significance: 0
* Priority: 0

Absolutely not necessary, but pretty cool.

**Tasks**:

* Create a logo
  * Mix of the main technologies?

## Note about the priority

The _priority_ criteria can be considered as an order indicator.
And it kinda is.

This value is more closely related to this boilerplate popularity.
It does not need to be as used as a C kernel,
but the prioritization of a feature can change with feedbacks.

> Feedback can also be given through other means than GitHub.
