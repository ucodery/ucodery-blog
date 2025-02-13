---
title: The Trouble With Poetry
description: Why not to use the poetry packaging tool
feature_image: ./shipwreck.jpg
feature_image_description: the bow of a shipwreck rising out of a sandy beach. All that remains are rusted iron supports, reminiscent of as ship skeleton
feature_image_attribute: Jeremiah Paige, all rights reserved
date: 2024-08-12
tags:
  - python
---

# The Trouble With Poetry

I have a problem with using poetry.

It's not the [slow solve times](https://python-poetry.org/docs/faq/#why-is-the-dependency-resolution-process-slow), the custom lock file and its
tendency to [produce merge conflicts](https://www.peterbe.com/plog/how-to-resolve-a-git-conflict-in-poetry.lock), or its [unstable support for C
extensions](https://github.com/python-poetry/poetry/issues/2740). It's the blaze-your-own-path mentality that leaves behind so much scorched
earth.

## Breaking All the Standards

The [Python Packaging Authority (PyPA)](https://www.pypa.io/en/latest/) is an informal, volunteer-led group of individuals that attempt to bring
together the many _(!)_ Python packaging tools through community-accepted standards. These standards include the
[wheel distribution file format](https://packaging.python.org/en/latest/specifications/binary-distribution-format/) and the
[pyproject.toml metadata file format](https://packaging.python.org/en/latest/specifications/pyproject-toml/#pyproject-toml-specification). The PyPA
gains consensus on these standards using the [PEP process](https://peps.python.org/pep-0001/), the same process that is used to implement all major
changes to the Python language itself.

Poetry does not seem to care about this consensus or community building.

Poetry views the existing system of Python packaging as bad and not worth saving, perhaps not without cause. However in its drive to make packaging
"easy", it makes strong decisions that do not take into consideration the rest of the Python world. Python packaging is a diverse, ill-connected, group
of tools and not everyone is a Poetry user, [perhaps 1/3 are, according to one 2022 survey](https://drive.google.com/file/d/1U5d5SiXLVkzDpS0i1dJIA4Hu5Qg704T9/).
Not everyone else is a Setuptools user either, it makes up less than 1/2 of the same demographic's responders. Python packaging is a collective of
many diverse inter-operating tools.

The one thing that all users of Python share is the use of remote distributions; that is, 3rd party packages or even simpler: installing some code.
If Poetry was only trying to be a dependency management tool, I might have fewer issues with its decisions. Installing is after all the conclusion
of a successful packaging journey. Managing that Python environment and the packages that live in it is a decision to be made by those working in
that environment and doesn't affect those not working with the environment. But package building, Poetry's other designated problem space, is at the
beginning of the packaging journey. Once a package is created, the process of sharing that code has only just begun. And after it is published,
whatever else happens with that package is out of the author's control; it is out of Poetry's control. This is why it is so important to create
packages with care and regard for the immensely broad and diverse and to some degree _standardized_ world of Python.

I am not forced to use Poetry's environment management. But I am forced to deal with Poetry's terrible packaging practices unless I want to give up
a significant percentage of Python's packages.

At this point, you might wonder "What terrible practices? Doesn't Poetry read `pyproject.toml` and publish wheels, just like everyone else?"
And yes, Poetry does store all its package metadata in `pyproject.toml` and it creates wheels, the PyPA file format,
as well as the very common sdist file format. This is why code packaged with Poetry can interoperate with projects or environments
not managed by Poetry. It is not the built file that is a problem, but rather the metadata that Poetry requires and the metadata it
chooses to forward through these standards.

## Embracing and Extending the Open Standard

Poetry does indeed use `pyproject.toml` for project metadata, it was an original adopter of the file. But the only universal fields it uses are those
in the `[build-system]` table which exist to tell the rest of the world that Poetry is in charge of this project. The other universal fields in the
`[project]` table are still not supported [4 years after the standard was set](https://discuss.python.org/t/pep-621-round-3/5472/109), well after
virtually all other Python packaging tools accepted full support for all the standard fields, as well as new ones that have been added since then.
Poetry indicates it might start to support this metadata with a [new breaking major release](https://github.com/python-poetry/poetry/issues/9136).

Until that happens, and maybe even after it does, all of the same information must be specified in a table controlled only by Poetry, `[tool.poetry]`.
Many of the fields are identical in key and value type and all but 4 are representable somehow in the standard table: `include`, `exclude`,
`packages`, and `package-mode`. Yet to use Poetry you must specify all information in Poetry's table using Poetry's format.

And while Poetry doesn't use any information specified in `[project]`, neither does it warn when a `[project]` table is present in a `pyproject.toml`
it is reading. This can make it quite easy for an author to accidentally add project metadata into this table, perhaps because all the top guides online
mention adding it to the universal `[project]`, and for that metadata to subsequently be silently dropped before making it into a build.

This isolated use of metadata means migrating a project to Poetry is essentially starting over for describing the project in configuration. Even if the
project was using all open standards, nothing can be brought along in the migration.

## Groups For Me But Not For Thee

Python packages have supported enhanced install targets called extras since their inception. It is a way of getting a package and everything it requires
_plus_ some extra packages it doesn't require, but might make it better. Examples of extras are `requests[socks]` or `boto3[crt]` which install the requested
package, plus some extra packages otherwise not included without an extra. All extras do is make the install footprint bigger, but the implication is that
the installed package will recognize the presence of optional dependencies and expose more features.

However, extras aren't always used to trigger exposing new functionality. Many times they are used to install extra development dependencies, not necessary
to the end user. For instance, if you wanted to run `virtualenv`'s test suite locally on your system against the installed version, but didn't know
what else that would require you to install, you could simply install `virtualenv[test]` to add whatever packages the maintainer set in that extra.

This (ab)use of extras is very useful in that it is a standard agreed upon by the entire Python packaging ecosystem for defining sets of additional requirements.
This means that declaring these groups does not have to be repeated if you move to different test tools, or if you use more than one testing environment, like
Nox and GitHub actions and Read the Docs. Depending on who and when you ask, this is either a great use of extras or a terrible abuse of its intended meaning.

I believe Poetry is more of the opinion that it is abuse. Because instead of bucketing dev dependencies into extras, Poetry has a new system called "groups".

Poetry does of course also support the idea of extras. After all, it is part of the standard Python package metadata, and Poetry seems to agree that if it is
intended for use by the package consumer, it should be an extra and not a group. But because Poetry doesn't support the universal `[project]` table it doesn't
define extras in the same place everyone else does, in the `[project.optional-dependencies]` table. Rather it again uses a private table, `[tool.poetry.extras]`.

Its alternative, groups, are designed for development dependencies and, as Poetry's docs clearly state, "Installing them is only possible
by using Poetry." Meaning that this information is not forwarded into the package metadata like extras are, but instead locked away forever in a
private Poetry-only toml table. There is no workflow involving groups that does not necessitate using Poetry as the environment manager,
package solver, package manager, and build front-end.

You might think this is no big deal, the maintainer has locked away their development workflows behind their preferred development workflow manager. But
you might be surprised that there are quite a few groups that aren't a package maintainer but are interested in that package's development workflow. Not all
of them want or are capable of using poetry to work with this package. Redistributors like Conda need to be able to work with all packages, despite what each
one's maintainers have chosen as the blessed workflow tool. There also are potential contributors who don't know how poetry works but have the skills to
make a change and fully test it who must now either learn Poetry top to bottom or not contribute. Even the main contributors of a Poetry-based package likely
want to use other Python tooling that needs to know about development dependencies, like their IDE. By not using the already agreed upon universal
`optional-dependencies` table, each IDE must choose to special case Poetry or else not support Poetry projects very well.

## Version Ranges Were Never the Problem

A little recap on [Python Version Specifiers](https://packaging.python.org/en/latest/specifications/version-specifiers/#id5). These are
the operators that can be applied to version strings to restrict dependencies to compatible versions. The full set of standard Python
version operators are `<`, `<=`, `!=`, `==`, `>=`, `>`, `~=`, and `===`. Much like Python objects'
[rich comparisons](https://peps.python.org/pep-0207/), they are
[not all necessary](https://docs.python.org/3/library/functools.html#functools.total_ordering)
as they could be reduced to only `<`, `>`, and `==` at the potential cost of readability. I speculate that the only operator in the list not intuitive
to C-style language readers is `~=` which has nothing to do with negation but is the Compatible Release operator. Its rules are a bit
complex, but as an example `~=2.0.4` could be translated to `==2.0.4, >2.0.4, <2.1`. Every operator has specified semantics and provided
examples, maintained by the Python Packaging Authority.

Poetry also has Version Specifiers (or [Version Constraints](https://python-poetry.org/docs/dependency-specification/)). It supports every operator
mentioned above except `===` but adds three more: `^`, `~`, and `@`.

`^` is Poetry's SemVer Compatible operator. While it at first looks like it matches `~=` it results in a different ceiling:
`^2.0.4` would be rewritten as `==2.0.4, >2.0.4, <3`. As Poetry regards SemVer as good and universal, this is the operator applied to all
newly added dependencies that aren't otherwise provided an operator. And because it is the default, it ends up restricting most
dependencies of all Poetry-managed projects.

While `^` might have looked like what `~=` does at first glance, `~` is even harder to differentiate. And not only because they both use tilde. Poetry's
`~` will agree with `~=` for most specifiers, except that `~=` is specifically not allowed for single segment versions (`~=1` and `~=2024` are both not
allowed), but Poetry not only allows it with `~`, it is one of the posted examples of how to use the operator.

The `@` operator, despite being called an operator and listed with the other Version Constraints, seems to be a command line value
delimiter. It doesn't do anything on its own but is used with some other operator to specify a full package+version value in one
string. Or, if no other operator is given, Poetry will pick its favorite `^`. Or the version `latest` which picks the latest version and attaches
a `^`. Thus, when passed as command line values `my_package`, `my_package@` ,`my_package@latest` ,and `my_package@^2.0.4` all turn into `my_package = "^2.0.4"`
in `pyproject.toml` (provided 2.0.4 is the most recent release) while `my_package@2.0.4` will instead turn into `my_package = "2.0.4"` and
`my_package@==2.0.4` into `my_package = "==2.0.4"`.

Although Poetry doesn't support `===`, it does have a secret `=` operator. Its meaning I can only speculate on as it is not mentioned anywhere in the
documentation. But it is accepted as a Version Constraint in `pyproject.toml` or from the command line and not converted to any other format.

In addition to creating new version operators, Poetry also has co-opted the meaning of the existing Version Scheme to mean something different
for itself. While the PyPA spec for Version Scheme clearly states "a _trailing_ ._ is permitted on public version identifiers" (emphasis mine),
Poetry will accept `_` as a full version scheme (in place of any number segment).

## Thou Shall Know Thy Python Compatibility

Poetry is determined to know that a package is compatible with every version of Python it says it supports. But this is an impossible task.

Generally, Python package authors are interested in the code they write being compatible with some set of already-released
versions of Python, but also some set of yet-to-be-released Python versions. The set of already released compatible versions can be known, with extensive
testing. But the set of future compatible versions is unknowable. Because they haven't been created, the author doesn't know what will change in that version.
Poetry believes that Python is SemVer compatible, as evidenced by its default selection of the SemVer Compatible operator (`^`) plus the currently executing
Python version as the Python dependency of new projects. [But that really isn't true](https://pyfound.blogspot.com/2024/06/python-language-summit-2024-should-python-adopt-calver.html)
and it might become even less true if [Python finally moves to CalVer](https://peps.python.org/pep-2026/).

This practice of artificially constraining yet-to-be-possible deployment environments by adding ceilings to version ranges is a problem for any package's
dependencies. But it is doubly so for the Python dependency of a Poetry project.

Poetry likes locking project dependencies. It _really_ likes locking. And when Poetry locks a project, it records every version of Python that a dependency
is compatible with. If Poetry finds that any dependency has a Python compatibility that does not overlap fully with the range of Python versions you have
declared for your project it throws an error.

For instance, if a project that wants to be compatible with every possible Python3 version (`^3`) tries to add `black`, it isn't allowed. Note that it
doesn't matter if black is added to the base dependencies, to a group, to extras, or marked as optional. When Poetry locks a project it considers all
possible multiverses and requires that every one is possible to resolve. This is the error it will show when trying to resolve this conflict:

> The current project's supported Python range (>=3,<4) is not compatible with some of the required packages Python requirement:
>
> \- black requires Python >=3.8, so it will not be satisfied for Python >=3,<3.8

This leaves the author with a few possible resolutions:

1. **don't use black**

   this seems bad, Poetry has driven the author away from using another development tool in its obsession to solve the multiverse

2. **use a version of black that is compatible with all my Python versions**

   this is simply impossible for many dependencies, including `black`, which even in its first alpha version required `python >.3.6`

3. **use black but don't tell Poetry**

   why use a builder, package solver/manager that you don't tell all of your dependencies about? A developer should not need to go behind their tooling's back to accomplish their needs

4. **change your supported Python version to align with Black**

   this seems on the surface like the best option to move forward with a new dependency. But this is the most insidious solution

This example demonstrates that Poetry has a point. If you want this package installable for every Python3, then it can't bring in black. But this is
an example of mismatched floors. What Pythons of the past are available and what their compatibility is can be known before release. What the future brings is
not so clear, and putting restrictions on versions that don't exist yet is the height of pessimism.

Poetry-resolved software is only ever compatible with versions of Python set by its most restrictive dependency. This leads to Python ranges that
only shrink as they take on new dependencies. And once they shrink their Python compatibility range, they have the knock-on effect of shrinking their
dependants' Python range. Maybe in a world of perfect compatibility knowing this would be a good thing. But with Poetry's eagerness to put a ceiling on
every dependency range (with `^`) these Python ranges are shrinking even faster than is necessary.

Let's return to the example and take option 4: we set the Python compatibility of our package to `>=3.8`, the exact same as `black==24.8.0`. Now our package and
its single dependency are in complete agreement about supported Python versions and Poetry is happy. Next, we go to add our second dependency, `textual`:

> The current project's supported Python range (>=3.8) is not compatible with some of the required packages Python requirement:
>
> \- textual requires Python <4.0.0,>=3.8.1, so it will not be satisfied for Python >=3.8,<3.8.1 || >=4.0.0

So `textual` has a Python version ceiling! We have two dependencies, both with a floor of `3.8` (almost), but `black` has no ceiling, while `textual`
does. We must again restrict our supported Python versions because a dependency of ours has put a ceiling on Python versions not yet released. You can
probably see again from this example that Poetry pushes projects to use smaller and smaller Python version ranges. And through this behavior, Poetry
is spreading the artificial ceiling of `python<4` across the Python ecosystem wherever it touches it. All it takes is one dependency, even indirect,
with a ceiling (remember, this is Poetry's default for all new projects) to push a package that was previously open-ended on its Python version to add
a ceiling itself.

This might not bother the maintainer, beyond the bit of red text that disrupted their workflow. They want to use the dependencies they want and probably see the `4`
as no big deal. It perhaps sounds a long way away. Or maybe they have heard that there never will be a Python4. If that were true then the worst part of these ceilings
is that they make busy work for maintainers without adding any added protection. But what if there was a Python4, or maybe a Python26? If that happens then,
no matter how carefully planned and compatible such a release is, it would instantly make thousands of Python packages unusable. Because the Python ceiling metadata
makes its way into built artifacts as the standard `Requires-Python` field. Although Poetry may be the only Python tool to reject incompatible future releases, all
other tools respect this field for the version of Python being worked with immediately and would not install a package that states it is incompatible with the current
version of Python.

## Wrapping Up

Poetry is _beautiful_ - from its homepage to its minimalistic colored CLI output, to the thought put into UX, it's nice to look at.

It's simple to get started and promises to wash away the pain of packaging. It does seem to be easy to start with and will _do_ packaging.
But the deeper you go with poetry features the harder it is to get out. And getting out is not one dimension of project management.
Nearly all of it would have to be dealt with at the same time: dependency management, installation, dev setup, deployments, publishing, locking,
CI, all of it would need to be changed simultaneously because poetry doesn't interoperate with any other tooling.

This is the appeal of a walled garden. It's beautiful inside and walking in is easy. But once you set up shop inside you can't leave with anything
you've built there. And even if you stay you can't bring in anything new. Packaging Python with Poetry is packaging for the
poetry-python-ecosystem, not packaging for the python-ecosystem with Poetry.

That narrow focus on what might make packaging easier only for oneself, no matter what effect it has on others, is not a view that will
carry forward Python's legacy of extensive and awesome packages that have long given Python so much of its appeal.
