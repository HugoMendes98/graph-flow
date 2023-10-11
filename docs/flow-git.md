# Git flow

How to use _git_ with this project.

> To know how to develop in this project, go [here](./flow-dev.md).

## Table of contents

<!-- TOC -->
* [Git flow](#git-flow)
  * [Branch naming](#branch-naming)
    * [Work branches](#work-branches)
    * [Fix branches](#fix-branches)
    * [Documentation branches](#documentation-branches)
    * [Other branches](#other-branches)
  * [Commit message](#commit-message)
  * [Merge/Pull Request](#mergepull-request)
    * [Creation](#creation)
    * [Review](#review)
    * [Validation](#validation)
    * [Approval and merging](#approval-and-merging)
    * [Merge commit vs squash merge](#merge-commit-vs-squash-merge)
    * [After merging](#after-merging)
<!-- TOC -->

## Branch naming

There are 2 main branches on which modifications are (normally) not directly applied:

* **master**: Represents a stable production state:  
     All the code works and provides a functional solution.
* **develop**: Usually before merging on **master**:  
     A functional code on which is added a set of new features to be tested for validation.

> **When can _master_ or _develop_ be modified ?**  
> These branches should never be modified directly (see [Merge/Pull Request](#mergepull-request)).
>
> But it can be done if the following conditions are true:
>
> * All members are aware of the changes and have agreed to them.
> * The changes are ridiculously small (or they are not really developed features).
> * They are made on a critical time or to test infrastructure.
>
> > Here's some examples:
> >
> > * The **CI** has just been set on a _production server_. The change: increase timeout
> > * An update of an infrastructure needs to change some parameters.
> >     The change: update configuration/environment values

### Work branches

To develop, use the `dev/` branch directory.
It is also the _feature_ directory.  
These work branches are followed by a meaningful name or nominal group.

**Examples:**

* `dev/back/login`: implementation of the login in the _backend_ code.
* `dev/common/create-dtos`: Creations of common _DTO_s
* `dev/update-id`: Change the type of entity IDs from `string` to `number`

> If using a 3rd party project management, such as [Jira](https://www.atlassian.com/de/software/jira?&aceid=&adposition=&adgroup=143040442725&campaign=19324539974&creative=642068918877&device=c&keyword=jira&matchtype=e&network=g&placement=&ds_kids=p74609403311&ds_e=GOOGLE&ds_eid=700000001558501&ds_e1=GOOGLE&gclid=EAIaIQobChMI3dmmvtS__gIV0MztCh0uDwJLEAAYASAAEgIibvD_BwE&gclsrc=aw.ds),
> It could be more efficient to add the Issue/task ID in the branch name.

### Fix branches

If a feature has already been merged and a fix is needed, use `fix/` subdirectory.  
The naming is the same as the one for [work branches](#work-branches).

**Examples:**

* `fix/office/login`
* `fix/update-id`

> These branches can also be created from the
> [post-development testing](./flow-testing.md#post-development) process.

### Documentation branches

Use the `doc/` directory when the documentation is created or modified.

**Examples:**

* `doc/how-to-test`
* `doc/back/migration`

### Other branches

Except for the previous reserved names feel free to use other names for other kind of modification.

**Examples:**

* `infra/ci`: Update of the CI process
* `infra/docker`: Add some docker files
* `init/worker`: Add a new _Nx_ Library

> As the branches are deleted once merged, the naming is not that important.  
> But to keep thing clean and usable (notably on some Git editors)
> use existing branch directories (e.g. already a `documentation/bla` branch)
> or add reserved names to this documentation.

## Commit message

Use commitizen:

```bash
npx cz
```

The scope can be freely chosen.

> **Warning:**  
> Do not use a `fix` type for something that is not yet merged (on "your" working branch).
>
> Example:
>
> * A new feature is implemented:  
> `feat(login): can login`
> * Then, even before it is ready to merge, a bug is fixed  
> `chore(login): do not return the sent password on login`
>
> Keep in mind that the `fix` type will appear in the **CHANGELOG**.  
> It would be strange if a `Bug fixes` section appears for a bug that never occurred.

## Merge/Pull Request

This section describe how to create/review/approve/... a _Merge Request_
or _Pull Request_ (or whatever is used).

> **PR** (**P**ull **R**equest) will be used to reference this.

### Creation

When creating a **PR**, use a meaningful title and add the issue(s) in the description.
More information can be added in the description if necessary:

* Errors encountered (for the reviewer)
* Important change (not related to the current feature)
* New utility added (class/function)

### Review

No real constraints here except to be humble when reviewing;  
_Nobody's always true, anybody can still be wrong_.

### Validation

* All **CI** tests must succeed.
* The styleguide must be respected.
* The code is up-to-date.
* (There's tests for the added feature(s))

> **What is the styleguide applied?**  
> See [here](./styleguide.md).

### Approval and merging

To merge a **PR**, all conversations must be resolved and approved by at least one other person.

> A **PR** can be verbally approved (live review),
> so it can be auto-approved with the given message `approved verbaly by <user.name>`.

### Merge commit vs squash merge

There is no answer to this here.
It is up to the team (or the reviewers of a **PR**) to define it.

> Keep in mind that a _squash_ leaves a cleaner history,
> but removes information about it.  
> It also can generate an incomplete CHANGELOG.

### After merging

After merging, the branch must be deleted.  
In which case, manual tests must be performed on the server(s).  
If an error is found, then the _merge_ is revert or a _fix_ branch is created.

> The purpose of these manual tests is to ensure that the deployment worked
> and that no obvious errors occur.
