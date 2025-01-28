---
title: Tools of the Trade
description: my best setup for writing code
feature_image: /img/wood_tools.jpg
date: 2022-11-07
tags: []
layout: layouts/post.njk
---

# Tools of the Trade

All code has to be written somewhere and the environment in which it is written helps to shape it, either explicitly or implicitly. This is where I like to do my best work and why I think it matters.

## System

### macOS

I only really feel comfortable writing code on a UNIX-y system

When I am not coding I have other tasks I need to do for my job or just for fun and I need to be able to run and depend on certain programs just working. It also largely takes away the need to select my hardware and OS as a pair, which I like. I already take too much time customizing what my dev stack looks like, I don't need to also shave hardware yaks. It is also the only way to reliably build and test software for the big three OS choices: macOS can run virtual Linux or Windows, but Linux and Windows can't run virtual macOS.

### ErgoDox Keyboard

I wish I could use this mechanical keyboard everywhere I use a computer

Okay, I know I just said I don't need to shave hardware yaks, but this one is important. While the ergonomics are nice, split, ortholinear, tilted, I primarily love it because I can remap any key without relying on any software being installed on the system. Besides moving the CTRL keys to my thumbs, I have an entire layer that is just programming symbols so I can write syntax from the home row.

### Homebrew

open source package manager that just works

I need some system package manager to set up my environment. I greatly prefer homebrew's style of centrally locating files and then symlinking where they need to appear. I choose tools that take this approach anytime I need a package manager. It makes it easy to audit what is actually installed, who installed it, and to clean up packages that aren't behaving with just an rm. The rest of the utilities below are installed and managed by homebrew.

### alacritty

a highly customizable terminal that doesn't try to do the work of other layers

alacritty is customized through a YAML file, which means I can check in my terminal settings with my other dotfiles. I don't change all that much from the defaults, just setting my custom font, disabling the bell, setting external application launching and customizing the mouse word-select, and copy-and-paste buttons. I leave things like window and tab management, and hotkeys to applications running in the terminal.

### bash

a shell that is both familiar and powerful

bash is almost always available on the system I am logged into, whether it is a work machine, VM, CI, or container. And where it is not already available, it is a simple matter to get it for any of macOS, Linux, FreeBSD, or Windows. Short of writing POSIX-compliant sh, bash scripts will be the most portable shell scripts and at this point, I just know how bash works better than any other shell.

### starship

status lines just the way I want them

I have always found the bash PS strings to be ugly, hard to write, harder to read, and hardest to discover how to add new abilities to it. starship looks great, is clear to read write or even add extensions for, and I can take it with me if I jump into a new shell.

### neovim

my all-in-one editor

The only editor I need - I use neovim for writing or even just reading nearly all files. Not just code but config and prose. neovim not only takes the role of my IDE, but it is also my window manager, search bar, task runner, and source of all shortcuts.

### bat

a complete replacement for cat and man

I have cat and man fully shadowed by bat and batman, respectively, in my shell and I have never looked back. The bat-extras package comes with even more useful utilities, but no others have replaced their classic counterparts.

### fd

a great reimagining of find, but not a replacement

I use fd more than find but its use of regex over globing can make it more verbose to invoke, even if it is faster. Also, find's very common use in scripts makes it difficult to replace with a utility that does not provide compatible options.

### the silver searcher

a fast reimagining of grep, but not a replacement

I almost exclusively use ag for searching on the command line. I prefer it to grep, finding its regex and options more intuitive, and noticeably faster. However, just like with fd, I don't shadow grep with ag as the options aren't compatible.

### tldr

short alternative to man

Not a replacement for man but many times it will jog my memory for a correct command faster than reading the complete documentation.

## Python

### pyenv

won't let your pythons mix

I use pyenv for building and managing all python interpreters I use. I appreciate the centralized location of environments which makes it easy to locate any dependency file and also keeps them outside of project source trees.

### virtualenv

leave creation to this tool but use a higher-order environment manager

I believe every python project needs its own virtual environment, and to manage those many environments I use pyenv-virtualenv. This keeps the virtual environments in the same location as the base python environments and combines the creation and activation of virtual environments with the building and enabling of base pythons.

### bpython

better interactive python

Its great that python comes with a REPL built-in but, as with much of the standard library, what come for free with the interpreter is not the most feature-rich version it can be. Any by also using PYTHONSTARTUP I am able to have bpython loaded by default when vanilla python commands are run.

### pip

the dependable foundation of python

There is nothing better to me than the tried and true installer. I always invoke it as python -m pip, even though I am always in a virtualenv, and this way it has never given me any problems.

### flit

the great little packager is everything I need it to be

It is a small dependency to take on that does the entire final mile - it takes my project from source to package on https://pypi.org when I need to release, which is not very often, and otherwise stays out of my way and does not dictate how my development takes place.

### blue

is my favorite shade of black

I think that black is an amazing tool that has bettered the python landscape. But even after having adopted it in personal and professional projects, the double quotes still look wrong to me. blue makes my code look exactly like I want it to.

### usort

a simpler import sorter

I have become discouraged by the level of configuration that isort has accumulated and in trying to keep all its options and their interactions in my head. And it does have to be configured to some degree, the defaults are not sufficient for a new project, especially when also using blue (or black).

### pyright

the type checker that works for me

I moved to pyright as it has in all cases found the python files I wanted it to check more reliably and with less configuration. After taking it on as my primary type checker I find it also does a better job of checking my code. It also happens to be the type checker used by pylance, i.e. the python language server used by most IDEs and neovim so my inline type hints fully match my static typing checks.

### flake8

gets your code correct, not just running

I appreciate well-linted code. flake8 has great defaults out-of-the-box but a high level of customization and also an extensive set of plugins.

### tox

manages multiple dimensions of requirements and environments

Every Python project should have its own virtualenv, but most should have more than one, and the best way to manage those relationships is tox. And when those different environments also require different versions of Python, I let pyenv supply those base interpreters.

### pytest

because code needs tests

This testing framework allows new tests to start with the most minimal overhead; not even needing an import of the framework itself. When a project using pytest grows to sufficient size it eventually gets confusing and begins to look like total magic to newcomers, not in a good way. If it doesn't eventually do this, then the project is probably not taking full advantage of the power pytest brings. But I believe its power makes up for this eventual lack of specificity. There are also a significant number of plugins. Usually, you will need a few for any project, depending on that project's needs but there is one plugin I use for every project which is pytest-cases.

### mktestdocs

because docs need tests

Documentation needs testing just as much as code. And especially the code you have inside your docs. If you use markdown code fencing anywhere, this module needs running. If there is code in documentation that won't run, it is either out-of-date or confusing to some number of new users.
