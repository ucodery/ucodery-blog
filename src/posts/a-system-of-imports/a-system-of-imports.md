---
title: Strict Module Imports
description: A style guide about writing Python imports
created: 2026-05-20
tags:
  - python
updated: 2026-05-20
---

<div style="text-align: justify;margin-bottom: 40px;margin-top: 30px;font-size: 1.04em;font-weight: 450;">

A Python project is following Strict Module Imports if
every module used has its own import statement
and if every import statement
only brings modules into scope,
brings exactly one module into scope,
does not use `from <> import` syntax,
and always uses the module's fully qualified name as an import target (unless the package author has explicitly, publicly, exported the module from a different location).

</div>

## Why a project would want to adopt Strict Module Imports

What this provides is uniformity and predictability to imports and cross-module usage, which in turn
makes understanding of the code easier and potential for confusion lower.

By only binding module objects to names at import statements, every object created by an import
statement is known to be of a certain type. When reading imports, the reader knows that all the names
specified are going to be used in the usual module way, primarily for attribute lookup, and will
not be used in ways incompatible with modules, such as calling it or as an operand.

By specifying an import statement for every module used in the code, it becomes more difficult to
interact with that module through the wrong parentage. The import statement always specifies the
full parentage, which should match its fully qualified name. If that is not the fully qualified
name, it can be caught and fixed at one location.

It also becomes much more difficult to accidentally use a variable via a module in which it was
not defined; if that variable is always used via a module attribute lookup then "reusing" it through
another module that is not its direct parent will expose that indirection by additional attribute lookups.

## Benefits of adopting Strict Module Imports

Emerging from Strict Module Imports are a number of benefits that are the result of the singular
and uniform nature of the imports, but that pervade the package's code beyond import statements.

### Honest acknowledgement of the work being done

An important but often misunderstood fact about the Python import system is that loading a module is an all-or-nothing operation. The module object, for instance formed by reading and compiling a `.py` file, is typically created once in the lifetime of a process. It is done at the very first place that module is mentioned in an import statement, even if that module is not brought into scope by that import statement.

Whichever import statement styles are used by a program, for every module present in any import, Python loads and parses and compiles the entire module, regardless of usage. Strict Module Imports acknowledges this unit of work and when it happens by requiring that the imports of a module only be changed when introducing the possibility to load more or less external code. For any module already named, using extra attributes from that module does not introduce this possibility. The effort to create those objects has already been spent and with Strict Module Imports the additional name need only be used where it is needed, without altering the import scope.

#### Example

```py
# The module importlib is loaded and bound locally.
# metadata is not loaded, and is not accessible via attribute.
import importlib
```

```py
# The modules importlib and metadata are loaded and both cached
# within the interpreter. importlib only is bound in this module
# scope. metadata is accessible as an attribute.
import importlib.metadata
```

```py
# The modules importlib and metadata are loaded and both cached
# within the interpreter. metadata only is bound in this module
# scope. importlib is not accessible as a variable.
from importlib import metadata
```

```py
# The module importlib is loaded and cached within the interpreter.
# The function reload is bound locally after having been compiled
# by the loading of importlib.
from importlib import reload
```

### Focusing Reviews

Under Strict Module Imports, import lines are only changed when a new module comes into or goes out of use. This is important because it is only the first time a module is named in any import statement that a relationship forms between these two modules. Once a module is in, there is no extra cost to use other attributes provided by that module, and no need to call attention to the imports for the use of a new attribute of an already-used module. If import statements are part of a diff, the reviewer knows that the module relationships of this package have changed.

### Easier patching

If every object is looked up through its module then in order to patch that object, only one lookup path needs intercepted.
It is an easy mistake to make, intercepting the wrong lookup path, and to get it right in a package that
isn't following Strict Module Imports requires checking the imports section of the module under
test, also sometimes modules not used in the test, because one don't know and can't assume how objects are being shared.

#### Example

Consider this package

```py
# foo/color.py
class Color:
    def __init__(self, name):
        self.name = name

# foo/yellow.py
from foo.color import Color

def yellow():
    return Color("yellow")

# foo/blue.py
from foo.color import Color

def blue():
    return Color("blue")
```

Which has a test as such

```py
# test/test_blue.py
from unittest.mock import patch
from foo.blue import blue

def test_red():
    with patch("foo.color.Color") as intercepted_color:
        blue()
    intercepted_color.assert_called_once()
```

This test will fail. Not because `blue()` doesn't call `Color`, and not because `Color` is defined
elsewhere than in `foo.color`, but because `blue` made its own identifier to reference `Color`
directly without going through the module.

This could be fixed by adjusting the patch:

```py
# test/test_blue.py
from unittest.mock import patch
from foo.blue import blue

def test_red():
    with patch("foo.blue.Color") as intercepted_color:
        blue()
    intercepted_color.assert_called_once()
```

but that is fixing the symptom rather than the systemic cause. This patch doesn't help cover other tests that involve `Color`.
When testing code that uses `Color` in multiple places, each one must be patched according to how it is used, in some cases
leading to the same object requiring multiple patch contexts to cover it.

```py
# test/test_draw.py
from unittest.mock import patch
from foo.draw import draw_python

def test_draw_python():
    with patch("foo.blue.Color") as intercepted_blue_color:
        with patch("foo.yellow.Color") as intercepted_yellow_color:
            draw_python()
    intercepted_blue_color.assert_called_once()
    intercepted_yellow_color.assert_called_once()
```

If instead the package used Strict Module Imports, `import foo.color`, and always went through the module to access objects, `foo.color.Color`, then the test of `draw` could be written without having to know about the consuming module's import choice, and only require a single patch.

```py
# test/test_draw.py
import unittest.mock
import foo.draw

def test_draw_python():
    with unittest.mock.patch("foo.color.Color") as intercepted_color:
         foo.draw.draw_python()
    intercepted_color.assert_has_calls(
        [unittest.mock.call("blue"), unittest.mock.call("yellow")],
        any_order=True,
    )
```

### Easier reloading

importlib's `reload()` is a very useful development tool, but comes with a lot of caveats. Strict Module Imports won't remove all of those, but it can help with at least one. It can't fixup references to objects in the old version of the module, such as instances of classes still with a reference count. However, if all instance creation is done by referencing the class through its module object, then it makes it easer to know that new objects generally always come from the new version of the module.

#### Example

Consider this package

```py
# foo/color.py
class Color:
    def __init__(self, r, g, b):
        self.rgb = (r, g, b)
        self.name = pick_name(self.rgb)

# foo/blue.py
from foo.color import Color

def blue():
    return Color(0, 0, 0xFF)
```

If the following is done in an interactive shell

```py
>>> import foo.blue
>>> my_blue = foo.blue.blue()
>>> my_blue.name
'blue'
>>> my_blue.rgb
(0, 0, 255)
>>> my_blue.hsl
AttributeError: 'Color' object has no attribute 'hsl'
```

And if an hsl translation is subsequently added to the base `Color` class, trying to reuse it like this in the same open shell won't work

```py
>>> import importlib
>>> importlib.reload(foo.color)
<module 'foo.color' from '/home/monty/foo/color.py'>
>>> my_blue = foo.blue.blue()
>>> my_blue.hsl
AttributeError: 'Color' object has no attribute 'hsl'
```

You have to know that `blue` imported a private reference to the `Color` object and that `blue` must be reloaded, even when no code in that module has changed.

```py
# The earlier reload(foo.color) is still required.
>>> importlib.reload(foo.blue)
<module 'foo.blue' from '/home/monty/foo/blue.py'>
>>> my_blue = foo.blue.blue()
>>> my_blue.hsl
(240, 100.0, 50.0)
```

With Strict Module Imports, only `reload(foo.color)`, naming the one module that was edited, is required.

### Namespaces are preserved

Using Strict Module Imports preserves the namespacing of objects as defined in their original packages. This preserved ownership of objects by modules helps to maintain the logical structure and for thoughtfully-considered packages that should aid in reading and reasoning of those objects' usage. Even if the package used is not thoughtfully laid out, using Strict Module Imports still minimizes the number of possible names taken away from the local module. Reducing unnecessary pollution of module namespaces also means that objects with the same name from different modules is never an issue; only the module names brought into scope must be unique.

### Locality

By not giving up any more top-level module names than is necessary for imports, a package following Strict Module Imports also makes it readily apparent in its code which objects are defined locally as opposed to being defined elsewhere and only borrowed locally.

### Simplified Import Sorting

Most Pythonistas like to keep their imports sorted. But when mixing `import a.b.c` and `from a.b import d`, typical tooling places all `import a.b...` first despite the lexicographical order of the named module; the alternative is to force this order but interweave the two forms of import. And on top of that it is also common to collapse multiple, `from a.b import <>`, meaning that the names being introduce to the current module are only sorted within the higher sort order of their modules. When using Strict Module Imports, import sections can be sorted so that every used module is in order, top to bottom, and begins at the same offset from the start of the line.

### No anonymous imports

Excluding `from <> import` style imports also excludes `from <> import *`. So this ability to bind names without naming them, which is frowned on by PEP-8 and other style guides, becomes a non-issue.

### Exporting and re-exporting

In a system where everything is using Strict Module Imports, exporting is done by customizing the attribute access to the module itself. `__all__` is not something to worry about, and to be kept up-to-date by hand and anyways `*` is not possible. Instead, if exports need to be controlled, the module can define the special `__getattr__` function, which gives far more powerful abilities over a list of strings.

In order to re-export another module's attribute that module must be imported as its own object, and then a new variable in the current module is created and bound to the desired attribute of the other module. The name can be kept the same, or altered as necessary. As opposed to a `from <> import _` where the target isn't used, this makes it much more obvious that the import is necessary and cannot be removed.

## Further Reasoning

### Opposed from

Strict Module Imports is against `from <> import` because in this form the target specified after `import` can be anything. It may be a module, but it may also be a class, a function, a constant, or any object. And it isn't always clear; the difference between a sub-module and an instance of some other class can be subtle. To duck typing, it often doesn't matter. But for all the reason laid out here to prefer to know that every import is specifically loading a module, the `from` syntax is prohibited.

### An import for every module

Many of the goals of Strict Module Imports could be had without requiring every module have its own import line. But import lines are about more than just loading code into an object. Imports form relationships between modules that are important for understanding the needs of a module, both to humans and the interpreter. While an `import a.b.c.d` will always be sure to load four modules, and all will be accessible to the following code, also having an `import a` declares the need this module has on both external modules.

The other implicit use of modules is much more dangerous. Sometimes `import a` will give the following code access to both `a` and `a.b` even when `b` is a module. This is because some code elsewhere did an `import a.b` and since module objects are shared across the whole process, the current module benefited, supposedly. But this equally does not capture the full inter-module relationships needed and worse, it is depending on side-effects from other modules for its own soundness; side-effects that could easily go away, and likely not even be though of as a potential breaking change.

### Fully Qualified Names

Strict Module Imports insists on every module being loaded through its originating package path. This keeps the path to an object equivalent across the package. It also keeps the honest acknowledgement of work honest, as a module can only be loaded using a path that is not its fully qualified name if that alternate location already did an import using the fully qualified path. Fully qualified names also keep the project from misrepresenting its module relationships and introducing an unsoundness much like using a sub-module of a module (using the fully qualified name) but only importing the parent. Just as in that case, the work another module is doing to load that module for the current module is a side-effect and may go away at any time.

### Strictly lazy

Strict Module Imports are compatible with lazy imports: simply stick to the `lazy import <>` form and do not use `lazy from <> import`. Following Strict Module Imports for lazy targets makes the honest acknowledgement of the work being done even more honest. Since a `lazy from <> import _` makes every target a proxy object, if multiple (non-module) objects are imported they all start out as proxy objects, but as they all live in the same module, the first use of any of those targets triggers resolving all of them. This is less obvious when they don't share lookup through their module namespace.

### Future exceptions

The future statement requires `from __future__ import _` syntax. This unfortunately looks off when used with Strict Module Imports. However, the future import is not quite a true import, but is closer to a preprocessor statement, and will as always remain above other module import statements.
