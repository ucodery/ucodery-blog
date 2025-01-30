---
title: Managing My Python Environments
description: How I Tame My Python Environmetns
feature_image: ./industrial-crane.jpg
feature_image_attribute: Photo by <a href="https://unsplash.com/@rozetsky?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Ant Rozetsky</a> on <a href="https://unsplash.com/photos/black-metal-empty-building-SLIFI67jv5k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
date: 2024-05-18
tags:
  - python
---

# Managing My Python Environments

Python environment isolation is an important part of Python development hygiene.

If you are working with Python to any degree, virtual environments are a must. And I work with
Python daily, often different versions of the language and definitely different projects, daily.
To make this constant switching an effortless part of my job and not some nightmare, I have my
personal workflow for setting up and using Python environments. By not deviating from this workflow
for any Python task, I always have the Python version that I want for a project and have avoided any
pip confusion, environment corruption or distro corruption. My computer has not been declared a
superfund site.

# Pyenv

[Pyenv](https://github.com/pyenv/pyenv) is an awesome tool that when used to its full potential can
install new python versions, create new virtual environment, and automatically switch the current
active environment.

## Installing Pyenv

As with all other isolation solutions, there is a bit of a bootstrap issue with Pyenv. Pyenv is not
written in Python, so there is no circular setup to worry about there, but this means we need some
other way to install Pyenv. While most distro package managers have Pyenv, I have always installed
directly from the source with the command:

```bash
curl https://pyenv.run | bash
```

Once `pyenv` is installed the following command must be run for it to do its job. I have this line
in my `.bashrc` so it is already working wherever I open a shell but if you just installed this tool
you will have to run it now.

```bash
eval "$(pyenv init -)"
```

## Managing Python versions

Once Pyenv is on my system I use it to install all Python interpreters that I will use. I abandon
the idea that there even might be a Python on my system that was not put there by Pyenv. So my first
step is to install that first Python version with the simple command:

```bash
pyenv install 3.12.2
```

> NOTE: installing new pythons is done through a plugin, pyenv-build. But this plugin is
> installed with the base tool when installed through https://pyenv.run.

It is a little unfortunate that Pyenv requires exact versions when installing, but this is mostly
alleviated by just typing out the minor version number and hitting `TAB` and letting pyenv show you
what patch versions it knows about.

If the version you need isn't known about, you will have to tell Pyenv to refresh its index of
Python versions. This can be done with the command

```bash
cd ~/.pyenv/plugins/python-build; git pull
```

This might not be the obvious solution to the problem of Pyenv's index being out-of-date, but if you
run `pyenv install` for the version you want even when it's not there, Pyenv will helpfully print
out the exact command you need to run to update its index.

## Managing Python environments

Once I have all the versions of Python that I want to use installed, I'm still not ready to do any
Python work. I don't use any of the base language version environments directly. Instead every
use-case I have for Python is isolated to its own virtualenv, based on a base language environment.

In addition to managing Python interpreters, Pyenv can also manage virtualenvs, and it manages all
of mine. Creating a new virtualenv is a short command:

```bash
pyenv virtualenv 3.12.2 do-work-here
```

> NOTE: virtualenv management is done through a plugin, pyenv-virtualenv. But this plugin is
> installed with the base tool when installed through https://pyenv.run.

There are a few ways to have Pyenv automatically activate virtualenvs for me, but I mostly use the
`local` solution.

Once I am in the directory I want this environment activated for, like a project root, I run

```bash
pyenv local do-work-here
```

After that I don't think about Pyenv any more. When I am in this project, at any level, this Python
and any executables it has installed are available to me, and when I'm not they're not.

## An environment for every situation

In order always only use a Python managed by Pyenv, and also have Pyenv switch my environment for
every different task, I set up a specific hierarchy of environments.

The first environment I create on any new machine is not actually `do-work-here` but `common` which
I then set as the global environment. This is the only time I set Pyenv's `global`. After `common` I
create the `home` environment which I set as the local environment for my `HOME` directory.

I intend to never actually interact with the `common` environment. It is there just to catch any
situations where I failed to properly set an environment and not let me escape to some system
Python. I don't put any packages there, intentionally.

The `home` environment is where I like to mess around, especially in the interactive Python shell.
As it is local to my `HOME`, it generally catches me when I run Python outside of some
project-specific location. I install a random collection of fun packages here, many of which I have
recorded in a `requirements.txt` that I keep with my dot-files; things that make playing easier, like
ipython or rich. I never expect the packages that exist, or their versions, to remain stable in this
environment. It'll be whatever I whimsically put there. Accordingly, I never expect a tool or
service to consistently run based off this environment.

My setup would look this:

```bash
pyenv install 3.12.2
pyenv virtualenv 3.12.2 common
pyenv global common
cd  # if I'm not already HOME
pyenv virtualenv 3.12.2 home
pyenv local home
```

## Bespoke environments

Those are my defaults, but I strive to have a specific environment for each workspace. This means
not only one per python project, but also for any scratch place I am testing out new software or
writing some glue code.

Pyenv environments can be named anything but I always make it the same as the directory it is rooted
in, which is also usually the name of the project, like in the case of a checkout. If the project
requires a specific version I don't have, I `pyenv install` it, otherwise I pick the most modern
already-installed version which is easily done with `TAB`.

Whenever I find myself in a new workspace The setup is simple and one-time:

```bash
cd new-idea
pyenv virtualenv 3.12.2 new-idea --download # existing version, name matches dir
pyenv local new-idea
```

The `local` command will drop a `.python-version` file in the directory it is run in, which does
cause a little noise. I make sure to put `.python-version` in my global git ignore so I never commit
or otherwise see these files in git.

## Multiplexing environments

In some workspaces it is necessary to run multiple versions of Python at once. This is most common
in package testing. When this is needed an environment manager is typically used. I have used `tox`
`nox` and `hatch` each in my own projects and in others'. But these projects need access to all
those `python`s when they run and pyenv has hidden away all but the workspace-specific `python`.
In these cases I use `pyenv shell` along with its builtin ability to expose multiple versions at
once.

Pyenv's `shell` will make the named environments all active at the same time for the rest of the
current shell session. The `local` environment disappears, but will still be the active one after
exiting this session, or in another session open in parallel. When naming `shell` environments I
always choose the base unnamed python versions. Because the environment manager is going to
isolate any Python package installs, I don't need to also make a pyenv virtualenv in these cases.

```bash
pyenv shell 3.12.2 3.11.8 3.10.10 # list out all wanted version. as always TAB is your friend
python -m nox # or tox, or hatch...
```

### Isn't pyenv an environment manager?

I just said that I use Pyenv and nox together in a project, but those are two different environment
managers, aren't they competing? Well yes, but no. Both Pyenv and nox (or tox, or hatch) are
environment managers but they manage different layers and have different feature sets. Pyenv
manages my python versions (always) and my virtualenvs (most of the time). Nox manages my
virtualenvs, but only when I need multiple running at the same time. In addition nox manages
execution of tasks in those environments. I can't do that with Pyenv and also importantly, community
projects will commit to nox in a way that is hard to get out of, by committing core tasks to
`noxfile.py` in the source, while those who use Pyenv don't commit those files to the project.

# Killer Features

## Auto-complete

Part of initializing Pyenv in your shell not only sets it up to dynamically swap your `python`, but
it also adds auto complete to all commands and arguments. Because of this it really doesn't matter
how long it's been since the last time I interacted with it, I can remember all I need to do with
some completion suggestions. And not only the sub-commands, but the arguments can also be
auto-completed with suggestions because of course I don't remember which of the 20 3.9 versions I
happened to install, or that I even installed any 3.9 on this machine but `pyenv virtualenv <TAB>`
will tell me.

## Does its job without me

One of the features I like best about pyenv is that when I am not actively setting up a new
workspace I don't think about it and it never gets in my way. It doesn't require sourcing scripts
or starting a new shell session; I never have to exec through pyenv and it doesn't alter my
environment variables when I move about.

## I know where all my virtualenvs are

Because Pyenv centralizes its virtualenvs and I make all virtualenvs through Pyenv, I know where
every virtualenv is on my machine. And they are not located inside my projects, where they can get
in the way or slow down tooling.

Also because I know where all virtualenvs are, I know where all installed packages are which is
important to me as I am always looking inside of my installs. I want to know if I have a
code example locally of using `HTTPServer`? `grep -R HTTPServer ~/.pyenv/`. Or I want to see an example
of a `.pyi` file? `find ~/.pyenv/ -type f -name '*.pyi'`.
