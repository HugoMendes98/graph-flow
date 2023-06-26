# Specifications

<!-- TODO: The specifications are not stored here? Say so.-->

## Table of Contents

<!-- TOC -->
* [Specifications](#specifications)
  * [Context](#context)
    * [The company](#the-company)
    * [Summary](#summary)
  * [Terminology](#terminology)
  * [Description](#description)
    * [Models](#models)
  * [Features](#features)
    * [Global](#global)
    * [Frontend 's home page](#frontend-s-home-page)
    * [Frontend 's group page](#frontend-s-group-page)
    * [Frontend 's _administrator_ page](#frontend-s-administrator-page)
    * [Frontend (global)](#frontend-global)
    * [Back-office login/signup](#back-office-loginsignup)
    * [Back-office profil page](#back-office-profil-page)
    * [Back-office's home page](#back-offices-home-page)
    * [Back-office's group page](#back-offices-group-page)
    * [Back-office free groups](#back-office-free-groups)
    * [Back-office (global)](#back-office-global)
    * [API](#api)
<!-- TOC -->

## Context

The company _AnAwesomeCompany ©_ contacted us to develop their new revolutionary web tool.

### The company

_AnAwesomeCompany ©_ is a company working in people management
which is known to be an assumed name.

### Summary

They wish for a web plateforme on which they can create and deleted users
and add them to named groups.  
They also wish to be able to show to anyone the associations of users they created.

## Terminology

* _Administrator_: An user that can access the _Back-Office_.
  * They are the representatives of _AnAwesomeCompany ©_
* _Backend_: The application that store and serves content
* _Back-Office_: The application used by the _administrators_
* _Creator_: An _administrator_ who created a group
* _Frontend_: The application that anyone can see
* _User_: Anyone that uses any part of the application

## Description

The plateforme will show to any _user_ who access the _frontend_
the created groups, that are public, and the _administrators_ being part of them.  
They must be able to search them on many ways.

Anyone can become an _administrator_ by signing up in the _Back-Office_.  
An _administrator_ can change its name at any time.

A group can have multiple _administrators_ and an _administrator_ can be on many groups.  
A group is created by an _administrator_ who becomes its _creator_.  
An _administrator_ can only create a group if his account exists for more than an hour.

When part of a private group, an _administrator_ can access its name and its creator information,
but not the other members of the group.

Only a _creator_ can modify or delete its group and add other _administrators_.  
However, any _administrator_ can leave a group he is part of.  
A _creator_ is not necessary part of its group.

An _administrator_ who deletes his account is removed from all of its groups
and all of its created groups become "free".  
A "free" group is a group without creator for which any _administrator_ can become its _creator_.

Plus, _AnAwesomeCompany ©_ has some partners that which to retrieve the data with an HTTP request.

### Models

## Features

The features are described using _user stories_ as defined in the agile methodology.

> <https://www.atlassian.com/agile/project-management/user-stories>

### Global

* As a _user_, I do not want to be blind when I see the user interfaces.
* As a _user_, I want that the filters are already applied, when I apply filters and refresh the page.
* As an _administrator_, I do not want anyone to access or
modify the protected data without permissions.

### Frontend 's home page

The home page of the application allows to browse the groups.

* As a _user_, I want to be able to navigate through the groups with a pagination system.
* As a _user_, I want to see the groups and be able to filter-and-order them by:
  * name (in my current language)
  * description (in my current language)
  * _creator_'s name
  * any _administrator_'s name or email
* As a _user_, I want to access the page of a group when clicking on it.
* As an _administrator_, I do not want one of my private groups to be shown here.

### Frontend 's group page

The group page is the view of a single group.

* As a _user_, I want to see the information of the selected group:
  * Its unique name
  * Its name
  * Its description
  * Its creator
* As a _user_, I want to see all the _administrators_ of the selected group and
being able to paginate them and filter-and-order them by:
  * firstname
  * lastname
  * Joining date (= creation date)
* As a _user_, I want to access the page of an _administrator_ when clicking on it.
* As a _user_, I want to have a message like "This group does not exist"
when the group does not exist.
* As an _administrator_, I do not want one of my private groups to be shown here.

### Frontend 's _administrator_ page

The group page is the view of a single _administrator_.

* As a _user_, I want to see the information of the selected _administrator_:
  * Its email
  * Its first and last name
  * Joining date (= creation date)
* As a _user_, I want to see the groups created by the selected _administrator_
and filter-and-order them by:
  * name (in my current language)
* As a _user_, I want to see the groups the selected _administrator_ is part of
and filter-and-order them by:
  * name (in my current language)
* As a _user_, I want to have a message like "This administrator does not exist"
when the _administrator_ does not exist.
* As an _administrator_, I do not want one of my private groups to be shown here.

### Frontend (global)

This concerns the global features of the _frontend_.

* As a _user_, I want to be able at any time to return to the home page with from the header link.
* As a _user_, I want to have a history of my 10 last group or _administrator_ visited,
from the current browser session in a sidebar.
* As a _user_, I want to be able to change the language.

### Back-office login/signup

* As a _user_, I want to be able to sign up with my email and a password
  * Also, I want to be access the profil page after the sign-up.
* As an _administrator_, I want to be able to log in with my email and my password
  * Also, I want to access my home page after the log-in.

### Back-office profil page

* As an _administrator_, I want to be able to change my first and last name.
* As an _administrator_, I want to be able to delete my account.
  * Also, I want a warning message before completing the deletion.
  
### Back-office's home page

* As an _administrator_, I want a button that redirects to my _frontend_ _administrator_ page.
* As an _administrator_, I want to see on which group of whichI am a member
with the following information:
  * name (in my current language)
  * _creator_'s name
  * private or public
* As an _administrator_, I want to see on which group of which I am a member
and be able to filter-and-order them by:
  * name (in my current language)
  * _creator_'s name
* As an _administrator_, I want to be redirected to the _frontend_ page
when I click on a public group of which I am a member.
* As a _creator_, I want to see the groups I created
  and access the group page when clicking on it.
* As a _creator_, I want to create a group by given its unique name.
  * Also, I want an error message if the unique name already exists.
  * Also, I want to be redirected to the just created group.

### Back-office's group page

The group page is the view of a single _group_.

* As a _creator_, I do not want anyone, other than me,
to access this page for one of my created groups.
* As an _administrator_, I want a message like "Not your group" or "Group not found"
when I reach a page of a group I have no access.
* As a _creator_, I want to button to access the _frontend_ page of the selected group.
* As a _creator_, I want to be able to change the translated name or description.
* As a _creator_, I want to be able to set the private or public status.
* As a _creator_, I want to be able to add or remove _administrators_.
* As a _creator_, I want to be able to delete my group.
  * Also, I want a warning message before completing the deletion.
  * Also, I want to be redirected to my home page after deletion.

### Back-office free groups

It is a special page when all the "free" groups are listed.

* As an _administrator_, I want to list and paginate all the "free" groups.
* As an _administrator_, I want to become the creator of a selected "free" group.
  * Also, I want a confirmation before the operation.

### Back-office (global)

* As an _administrator_, I want to be able to
access my profile page or the "free" groups page at any time.
* As an _administrator_, I want to be able to log out at any time.

### API

* As a _user_, I want to have enough documentation to complete a API HTTP request.
* As a _user_, I want to be able to requests the data from the groups.
