# Documentation (.md) styleguide

The _Markdown_ files are the documentation of this project.  
The idea is to have all the necessary documentation in the repository.

> This file is an extension of the global [styleguide](../styleguide.md).

## Table of contents

<!-- TOC -->
* [Documentation (.md) styleguide](#documentation-md-styleguide)
  * [_Repository as a doc_ approach](#repository-as-a-doc-approach)
  * [File structure](#file-structure)
    * [Vectoriel images](#vectoriel-images)
    * [Complete example](#complete-example)
  * [Writing](#writing)
    * [3rd & Active vs Passive](#3rd--active-vs-passive)
    * [Headers](#headers)
    * [Links](#links)
    * [ToC](#toc)
<!-- TOC -->

## _Repository as a doc_ approach

Each person has its own preferences, some prefer to write a _Word_ document, others a _Notion_.  
The purpose of this approach is to avoid dispatching all documentation in many places.

It does not only concern technical documentation, but any other kind of document.
For instance, the repository can also contain the _specifications_.

> It is not forbidden to use other systems, especially for more sensitive documents.

## File structure

The documentation files are always stored in a `docs` folder.
Only special files (like `README.md`) can be placed elsewhere.

Files (as images) for documentation are stored respecting the following path `docs/<folder>/<file>`.

* **folder**: is the _Markdown_ file without the `.md` extension
* **file**: the file image to store (can use subdirectories)

> This structure can be reproduced in the sub-folders.
>
> Use a `_lib` folder if there is common files.  
> Use a `images` folder if there is images.

### Vectoriel images

It is recommended to use [draw.io](https://app.diagrams.net/)
when creating schemas, graphes, ... .

There is plugins for the following IDEs:

* Visual Studio Code: <https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio>
* Webstorm: <https://plugins.jetbrains.com/plugin/15635-diagrams-net-integration>

> These files should have a `drawio.svg` extension.

### Complete example

From `/docs`:

```text
docs/
├─ doc-a/
│  ├─ doc-a1/
│  │  └─ images/
│  │     └─ a1-1.jpeg    # Appears in `doc-a1.md`
│  ├─ doc-a1.md
│  └─ images/
│     ├─ a-1.png         # Appears in `doc-a.md`
│     └─ a-2.drawio.svg  # Appears in `doc-a.md`
├─ doc-a.md
├─ doc-b/
│  └─ images/
│     └─ b-1.gif         # Appears in `doc-b.md`
├─ doc-b.md
└─ _lib/
   └─ images/
      └─ image.png       # Appears in `doc-a.md` **and** `doc-b.md` 
```

## Writing

_Markdown_ will not create empty spaces, so avoid _one-liner_ sentences.
In fact, a line can not have more than one sentence.  
Use other punctuations, as `,`, or linking words to split the lines.

**Examples:**

```markdown
<!-- Markdown -->
This is a regular sentence.

When this sentence will be too long,
I'll split at the punctuation.

It is not always easy to determine when to start a new line
but to try and keep the text readable.
```

> **Remember**:  
> This concerns the edition of _Markdown_ files, not their preview.

### 3rd & Active vs Passive

The first person should only be used to express
an opinion, a choice, a preference, ....  
The second person can be used to give instruction, but it is not recommended,
unless it is the imperative mood.

The passive voice should be preferred over the active one to omit pronouns.
Example:

> I load the data when the app is ready -> The data are loaded when the app is ready.

### Headers

All headers should start with an UPPERCASE,
unless it starts with a special formatting.

### Links

To optimize its navigation,
all files must be linked by another and possibly link **to** another documentation.  
So a new user can navigate through the documentation like a web page.

### ToC

Each file, expect the `README`s which are more like landing page,
have their own table of content at the beginning of the file,
after the main title and its abstract.  
The `Table of contents` header is not part of the table of contents.

> It can be easily generated (and updated) with Jetbrains IDE.  
> See official [documentation](https://www.jetbrains.com/help/idea/markdown.html#table-of-contents).
