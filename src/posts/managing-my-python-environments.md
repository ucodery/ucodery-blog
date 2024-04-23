---
title: Managing My Python Environments
description: How I Tame My Python Environmetns
feature_image: /img/python-2.jpg
feature_image_attribute: A Snake
date: 2024-01-30
tags:
  - draft
  - python
layout: layouts/post.njk
---
# Managing My Python Environments
Python environment isolation is an important part of Python development hygiene.

If you are working with Python to any degree, virtual environments are a must.
And I work with Python daily; often different versions of the language and definitely different projects, daily.
To make this constant switching an effortless part of my job and not some nightmare I have my own personal workflow for setting up and using Python
environments. By not deviating from this workflow for any Python task, I always
have the Python version that I want for a project and have avoided any pip confusion,
environment corruption or distro corruption.

# Pyenv
Pyenv is an awesome tool that when used to its full potential, can install new python versions, create new virtual environment, and automatically switch the current active environment.

## installing Pyenv
As with all other isolation solutions, there is a bit of a bootstrap issue with Pyenv. Pyenv is not written in Python, so there is no circular setup to worry about there, but this means we need some other way to install Pyenv. While most distro package managers have pyenv, I have always installed directly from the source with the simple command 
```bash
curl https://pyenv.run | bash
```

## managing Python versions
Once Pyenv is on my system I use it to install all Python interpreters that I will use. I abandon the idea that there even might be a Python on my system that was not put there by Pyenv. So my first step is to install that first Python version with the simple command
```bash
pyenv install 3.12.2
```

It is a little unfortunate that pyenv requires exact versions when installing, but this is mostly alleviated by just typing out the minor version number and hitting `TAB` and letting pyenv show you what patch versions it knows about.

If the version you need isn't know about, you will have to tell pyenv to refresh its index of Python versions. This can be done with the command
```bash
cd ~/.pyenv/plugins/python-build; git pull
```
This might not be the obvious solution the problem of pyenv's index being out-of-date, but if you simply run `pyenv install` for the version you want even when its not there, pyenv will helpfully print out the exact command you need to run to update its index.

Once I have all the versions of Python that I want to use installed, I'm still not ready to do any Python work. I don't use any of the main language version environments directly. Instead every use-case I have for Python is isolated to its own virtualenv, based on a base language environment.

## managing Python environments

In addition to managing Python interpreters, Pyenv can also manage virtualenvs, and it manages all of mine.
It is simple to create a new virtualenv
```bash
pyenv virtualenv 3.12.2 do-work-here
```

There are a few ways to have Pyenv automatically activate virtualenvs for me, but I mainly use the `local` solution.
Once I am in the directory I want this environment active, like a project root, I run
```bash
pyenv local do-work-here
```
After that I don't think about Pyenv any more. When I am in this project, at any level, this Python and any executables it
has installed are available to me, and when I'm not they're not.

## An environment for every situation

In order to never use a Python not managed by Pyenv, and also have Pyenv switch my environment for every different task, I
set up a specific hierarchy of environments.
The first environment I create on any new machine is not actually `do-work-here` but `common` which I then set as the global
environment. This is the only time I set Pyenv's `global`. After `common` I create the
`home` environment which I set as the local environment for my HOME directory.

I intend to never actually interact with the common environment. It is there just to catch any situations where I failed to
properly set an environment and not let me escape to some system Python. I don't put any packages in here intentionally.

The home environment is where I like to mess around, especially in the interactive Python shell. As it is local to my HOME,
it generally catches me when I run Python outside of some project-specific location. I install a random collection of fun
packages here, many of which I have recorded in a requirements.txt that I keep with my dot-files; things that make playing
easier, like ipython or rich. I never expect the packages that exist, or their versions, to remain stable in this environment.
It'll be whatever I whimsically put there. Accordingly, I never expect a tool or service to consistently run based off this environment.

My setup would look this
```bash
pyenv install 3.12.2 
pyenv virtualenv 3.12.2 common
pyenv global common
cd  # if I'm not already HOME
pyenv virtualenv 3.12.2 home
pyenv local home
```

Those are my defaults, but I prefer to have a specific environment for each project.

* a new venv for each python project and every different scratch space
* set a local env for each dir
* only use shell when (#multiplexed-env) is used.

## the auto-complete is sooo good

## hopping into a different environment is as simple as finding it in ~/.pyenv/

# Python environment multiplexing
tox nox hatch

# Pipx
I don't.
if it has to do with a project, make it part of one of that project's environments.
If not, install it into the Home environment, or use your distro package manager

# Misc
* gitignore
* bashrc
* install all tools necessary in the environment (black, tox...)
