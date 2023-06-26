# Styleguide

This file describes the styleguide applied to the [frontend-e2e](../README.md) application.

> It is an extension of the `common` [styleguide](../../../libs/common/docs/styleguide.md).

## Table of contents

<!-- TOC -->
* [Styleguide](#styleguide)
  * [File structure](#file-structure)
  * [Cypress studio](#cypress-studio)
<!-- TOC -->

## File structure

This section describes the structure for tests files.

Each file should be represented by a category of the [specifications](../../../docs/specifications.md).

## Cypress studio

Use _Cypress studio_ to generate most of the tests.
Then:

* The content of the file should be formatted (via `ESLint`).
* Use as much as possible the values from the database samples for assertions.

**Example**:

```typescript
describe("A test", () => {
  const db: Array<{ text: string}> = [/* from a sample */];

  beforeEach(() => cy.visit("/"));

  it("should have values", () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get(":nth-child(1) > h3").should("have.text", db[0].text);
    cy.get(":nth-child(2) > h3").should("have.text", db[1].text);
    cy.get(":nth-child(3) > h3").should("have.text", db[2].text);
    /* ==== End Cypress Studio ==== */
  });
});
```
