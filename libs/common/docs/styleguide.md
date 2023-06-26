# Styleguide

This file describes the styleguide applied to the [common](../README.md) library.

> It is an extension of the global [styleguide](../../../docs/styleguide.md).

## Table of contents

<!-- TOC -->
* [Styleguide](#styleguide)
  * [DTOs](#dtos)
    * [Property nomenclature](#property-nomenclature)
      * [Internal property](#internal-property)
      * [Foreign key](#foreign-key)
    * [DTOs transformer/validator](#dtos-transformervalidator)
    * [CRUD DTOs](#crud-dtos)
      * [Basic DTO](#basic-dto)
      * [Create DTO](#create-dto)
      * [Update DTO](#update-dto)
      * [Results DTO](#results-dto)
      * [Query DTO](#query-dto)
  * [Imports](#imports)
  * [Endpoint versioning](#endpoint-versioning)
<!-- TOC -->

## DTOs

The **DTO**s are the main data type that are transmuted through the application.
They represent the entities.
Even if they are abstracted from the real data stored in a database,
they are still pretty close to it.

It means that the basic **DTO**s should not be nested with others.

Bad:

```typescript
declare class GroupDTO {}

class UserDTO {
  public group!: GroupDTO;
  public login!: string;
}
```

Good:

```typescript
class UserDTO {
  public __group!: number;
  public login!: string;
}
```

> **Note**:  
> Internal data can still be nested:
>
> ```typescript
> class UserDTO {
>   public name!: { first: string; last: string; };
> }
> ```
>
> > Or if, from an outside point of view,
> the nested data can not be loaded as an individual resource.

**Why flat structures**?  
The idea is to avoid loading unnecessary data
and to favor _partial_ loading in the front pages;
loading the primary data, then their relation while the first is already showed.

It is always possible to link the relationship
if the objective is explained (performance, difficult filters).

### Property nomenclature

As showed in the example above, some properties starts with `_`.
It has different meanings and help to determine what is to use of a property.

There is 2 case in which they are used.

#### Internal property

These internal properties are very close to artificial properties.
They intend to provide additional information,
but to be detached to the real business data.

The following properties are readonly:

* `_id`: The unique ID of the data.
* `_created_at`: The date when the data was created.
* `_updated_at`: The date when the data was last updated.

> The dates, such as `_created_at`, is the date when the data was created,
> not the creation date of a product, for instance.

Other properties can also be internal integrity.  
For example, the translatable _DTO_s have a `_name` property
to define a unique identifier other than the `_id`.

#### Foreign key

When a **DTO** has a single-or-null relation with another **DTO**, it starts with `__`.  
Given the example:

```typescript
class UserDTO {
  public __group!: number;
  public login!: string;
}
```

A user is part of a group which the key is the value of `__group`.

> It is recommended to use the name of the relationship after the prefix,
> which makes it easier to know which data are linked.
>
> However, it can be necessary, or more meaningful to use another name.
> In which case a comment must be set:
>
> ```typescript
> class Parent {}
> 
> class Child {
>   // Both are keys to `Parent`
>   public __father!: number;
>   public __mother!: number;
> }
> ```

### DTOs transformer/validator

This project highly relies
on [class-transformer](https://www.npmjs.com/package/class-transformer)
and [class-validator](https://www.npmjs.com/package/class-validator)
for transforming/converting data and validating it.

### CRUD DTOs

They are 3 main **DTO**s for a **CRUD** operations.  
In this project, a forth and fifth one is added for filtering and reading many.

They should all be linked on a way or another to avoid redefining some code.  
For it, the [mapped-types](https://docs.nestjs.com/openapi/mapped-types) are used.

> The examples will be given with a complete _EntityDTO_.

#### Basic DTO

The basic **DTO** is the data that is returned
when reading one value, creating or updating a ressource.

Example:

```typescript
import { IsEmail, IsString } from "class-validator";

export class UserDTO extends EntityDto {
  @IsEmail()
  public email!: string;
  @IsString()
  public name!: string;
}
```

#### Create DTO

This **DTO** is used to create data.
It is mainly the re-use of the [Basic DTO](#basic-dto).

> It can be omitted for readonly resources.

Complete example:

```typescript
import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/mapped-types";

declare const ENTITY_BASE_KEYS: readonly ["_id", /*...*/];
export const USER_CREATE_KEYS_MANDATORY = ["email"] as const satisfies ReadonlyArray<keyof UserDto>;

export class UserCreateDto extends IntersectionType(
  PickType(UserDto, USER_CREATE_KEYS_MANDATORY),
  PartialType(OmitType(UserDto, [...ENTITY_BASE_KEYS, ...USER_CREATE_KEYS_MANDATORY]))
) {}
```

> **Note**:  
> The chunk of code `as const satisfies ReadonlyArray<keyof Dto>`
> makes the result class type to be correct.
> Otherwise, the type is not deterministic and wrongly checked.

#### Update DTO

Usually the Update **DTO** is no more
than the [Create DTO](#create-dto) which all properties are optional:

```typescript
import { PartialType } from "@nestjs/mapped-types";

export class UserUpdateDto extends PartialType(UserCreateDto) {}
```

> It can be omitted for readonly resources.

#### Results DTO

When querying some data, with filters and paginations,
the following structure is the following.

```typescript
export class UserResultsDto extends FindResultsDtoOf(UserDto) {}

const results: UserResultsDto = {
  data: [{ /* ... */ }],
  pagination: {
    range: { end: 1, start: 2 },
    total: 10
  }
};
```

#### Query DTO

This **DTO** is used to validate the query when reading from the `backend`.

## Imports

As this is the common library, and it is used almost everywhere,
no `backend` or `frontend` packages should be used.

> Unless they are only imported types (`import type {} from "...";`).

## Endpoint versioning

When an endpoint is versioned,
the previous implementation is moved to a directory with its version name.

The new version is the default one, and the previous one uses the newest to stay compatible.

```text
/v1
  /group.controller.ts
  /group.service.ts
/v2
  /group.controller.ts
  /group.service.ts
/group.controller.ts
/group.service.ts
```

Examples:

* V2 service:

```typescript
import * as v0 from "../group.service"
// v0 is the most up-to-date version

export class GroupService { // v2 service
  public constructor(private readonly service: v0.GroupService) {}
  
  public find() {
    return this.service.find().then(data => /* transform */);
  }
}
```

* V1 service:

```typescript
import * as v2 from "../v2/group.service"

export class GroupService { // v1 service
  public constructor(private readonly service: v2.GroupService) {}
  
  public find() {
    return this.service.find().then(data => /* transform */);
  }
}
```
