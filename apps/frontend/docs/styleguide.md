# Styleguide

This file describes the styleguide applied to the [frontend](../README.md) application.

> It is an extension of the `ng` [styleguide](../../../libs/ng/docs/styleguide.md).

## Table of Contents

<!-- TOC -->
* [Styleguide](#styleguide)
  * [Storybook](#storybook)
<!-- TOC -->

## Storybook

All components (not views) should have a `.stories.ts` file.
It allows to develop and test individual components.

> As mentioned in the [development flow](./flow-dev.md#dev-process).  
> Go [here](./commands.md#create-stories-storybook) to generate them.

## Dev content

All content in the `src/dev` folder is _dev content_.
The rules are less strictly applied to them as none of this content exists on any non-dev build.

This content can be used to experiment, show the design styleguide, ....

> The _dev content_ is not considered as a test.  
