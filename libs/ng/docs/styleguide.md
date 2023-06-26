# Styleguide

This file describes the styleguide applied to the [ng](../README.md) library.

> It is an extension of the `common` [styleguide](../../common/docs/styleguide.md).

## Table of contents

<!-- TOC -->
* [Styleguide](#styleguide)
  * [Structure](#structure)
    * [Views](#views)
  * [Components](#components)
    * [Subscriptions](#subscriptions)
  * [I18n](#i18n)
    * [I18n translation](#i18n-translation)
    * [I18n keys](#i18n-keys)
    * [I18n key storage](#i18n-key-storage)
    * [I18n structure](#i18n-structure)
  * [Styles](#styles)
    * [Tailwind like](#tailwind-like)
    * [Colors](#colors)
<!-- TOC -->

## Structure

The structure of this library is very close to the `common` one.

> **/!\ Do not use a unique module for the whole library!!**  
> Let the applications load the necessary modules and its dependencies.
>
> A module could not be used by some applications.

### Views

Views are special components whose purpose are only to be displayed as a page.
A view is defined by:

* One or more route path to it
* Has no selector (used via router)

A view can use _internal components_.
These components are stored in the `_lib` folder of the view and most not be used anywhere else,
in which case it becomes a common component.  
The sole purpose of this is to avoid too big view code.

<!-- TODO: better (Views as Modules?) -->

> **Example**:  
> Given a view with 3 tabs.
>
> ```text
> view-with-3-tabs/
> ├─ _lib/
> │  ├─ tab-1/
> │  │  └─ tab-1.component.ts
> │  ├─ tab-2/
> │  │  └─ tab-2.component.ts
> │  └─ tab-2/
> │     └─ tab-2.component.ts
> └─ view-with-3-tabs.components.ts 
> ```
>
> > Only the `component.ts` are shown.

## Components

The components should be as stateless as possible.
It is achieved by using the `Input` and `Output` decorators of Angular.

> It is still possible to use service inside components,
> if it is really needed how facilitate the development.

An example for a form:

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface AFormValue {} 

@Component({ selector: "a-form" })
export class AFormComponent {
  @Input()
  public value!: AFormValue;

  @Output() 
  public submit = new EventEmitter<AFormValue>();
}
```

It can be used on another component:

```angular2html
<div>
  <a-form [value]="{}" (submit)="doSomething($event)"></a-form>
</div>
```

---

Another example:  
if a list of users is shown, the `href` attribute is sent to the component.
The component does not need to know the link as it can be different from usages.

```typescript
import { Component, Input } from "@angular/core";

@Component({ selector: "user-item" })
class UserItemComponent {
  @Input()
  public href: () => string | null = null;
}
```

### Subscriptions

When using subscriptions (from observables),
**do not forget to unsubscribe !**.  
Even if the subscribe event is known to be finished or call only once,
consider all subscriptions as still subscribed.

Also, as a rule of thumb, subscribe and unsubscribe to them on an Angular lifecycle hooks,
such as [OnInit](https://angular.io/api/core/OnInit).

```typescript
import { OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";

declare class MyService {
 public getMyValue(): Observable<unknown>;
}

@Component()
export class MyComponent implements OnInit, OnDestroy {
  private mySubscription?: Subscription;
  public constructor(private readonly myService: MyService) {}
 
  public ngOnInit() {
    this.mySubscription = this.myService.getMyValue()
      .subscribe(value => {/* ... */});
  }
  
  public ngOnDestroy() {
   if (this.mySubscription) {
     this.mySubscription.unsubscribe();
   }
 }
}
```

## I18n

[ngx-translate](https://github.com/ngx-translate/core) is the library
that manages the I18n.

### I18n translation

* The translation nominal group must always start with a capital letter,
the eventual case transformations are done with CSS or Javascript.
* The translation sentences must end with their punctuation mark.
* Variables inside a translation must have a space between the `{{` and `}}`.
  * Example: `Hello, my name is {{ name }}.`

### I18n keys

**The keys for I18n are in `kebab-case`!**.  
The whole key path is formed from all the keys, joined with `.`.

Examples:

With the given keys: `action`, `button-click`.  
The key path is: `action.button-click`

With the given keys: `action`, `button-hover`.  
The key path is: `action.button-hover`

### I18n key storage

The keys are **not** defined manually in the locale files.
They are extracted with [ngx-translate-extract](https://www.npmjs.com/package/@biesbjerg/ngx-translate-extract).

The keys are detected when used with the translation providers,
such as the pipe, service and directive.
They can even be marked with a specific function (`ngx-translate-extract-marker`).

So the key path must **not** be concatenated.

```typescript
import { TranslateService } from "@ngx-translate/core";

declare const service: TranslateService;

function bad(type: "button" | "icon") {
  return service.get(`actions.${type}.click`);
}

function better(type: "button" | "icon") {
  return type === "button"
    ? service.get("actions.button.click")
    : service.get("actions.icon.click");
}
```

> It does require a bit more code, but the tool will still work.

### I18n structure

The resulting file must be coherent.
Parent keys can be used to determined where the translation is applied

Example (en locale):

```json
{
  "components": {
    "groups": {
      "group-preview": {
        "title": "This is the group {{ name }}"
      }
    }
  },
  "dtos": {
    "group": {
      "name": "Name"
    },
    "user": {
      "email": "Email"
    }
  }
}
```

> It is better to have duplicates than to have a too restricted structure.

## Styles

As the **CSS** is written with [SCSS](https://sass-lang.com/guide),
the shared styles must only export functions (or `@mixin`).
So it can be called, potentially with parameters, in the application codes.

> As does Angular with the [Angular material theming](https://material.angular.io/guide/theming).

For example:

```scss
// in `libs/ng/some-file.scss`
@mixin some-style { 
  .background-blue { 
    background-color: blue;
  }
}

// In `apps/front/another-file.scss`
@use "../../libs/ng/some-file" as base;
@include base.some-style();
```

### Tailwind like

Most of the time, use small class for css properties,
as does [Tailwind](https://tailwindcss.com/), but with more explicit names.

### Colors

As much as possible, abstract the colors.  
If the primary color is blue, then the color name is `primary`, not `blue`.

Example:

```scss
// Via SCSS variable
$color-primary: blue;

:root {
  // with a CSS variable
  --color-primary: blue; // $color-primary;
  // Or, with both
  // --color-primary: $color-primary;
}
```
