---
title: Convention Words
description: Special Words in Python
feature_image: /img/python-1.jpg
feature_image_attribute: Photo by <a href="https://unsplash.com/@davidclode?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">David Clode</a> on <a href="https://unsplash.com/photos/pjXcxEAMg40?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
date: 2023-07-19
tags:
  - python
layout: layouts/post.njk
---
# Convention Words
Python has keywords. These are words that have special meaning in Python programs and cannot be used for variable names. Recently, Python has also gained soft keywords. These are words that have special meaning to the language, but at the same time can still be used for variable names. But did you know that Python also has convention words?

Let's review. Keywords are a type of reserved word or a name that a programming language has removed from the choice of otherwise legal variable names. Some keywords in Python are `class`, `if`, and `None`. Unlike some other languages, Python uses all its reserved words as keywords. This means that every word that is taken out of use as a name has a specific meaning in the language. (Other than dunders, the infinite set of which are reserved).
If you want to know the complete list of Python's keywords you can ask Python itself.

```python
import keywords
print(keywords.kwlist)
```

Python also has soft keywords with the addition of match statements. This means that `match` can sometimes have special meaning to the language, but at the same time can be used for variable names. You could do this (but please don't!)

```python
match = "name"
match match:
    case str(case):
        print(f"{case!r}")
    case int(case):
        print(42 + case)
```

There is a third category of words in Python I am calling convention words. These are variable names that are used as if the language requires them purely out of social convention, even though it is not mandated by the runtime.

The first of these convention words is `_`. This name is often used to indicate "don't collect this value". But unlike some other languages, the value is still captured and the `_` name is bound. (Although in `case` clauses it has gained some special meaning).

```python
front, _, back = "cheese-shop".partition("-")
print(_)
```

The next pair of convention words are `*args` and `**kwargs`. These function parameters that can capture undefined extra arguments or keyword arguments, respectively, can be named anything you like. It is only the star and double star that make them special. This is one convention I would encourage you to break. Using good names is hard, but a really good idea and if you have something more descriptive than `args`, go for it!

```python
def map_a_tuple(a_tuple, *extra_index_entries, **extra_named_entries):
    map = {i:v for i, v in enumerate(a_tuple)}
    map |= {i:v for i, v in enumerate(extra_index_entries, start=len(map))}
    if hasattr(a_tuple, "_asdict"):
        map |= a_tuple._asdict()
    map |= extra_named_entries
    return map
```

Maybe the most surprising of Python's convention words is `self`. The first parameter name of a method does not need to be `self`. A method's first parameter can be any name and any other variable anywhere can be named `self`. And the same goes for `cls` in class methods. However, be warned, this is the strongest of all the conventions and you will only sow confusion by straying from it. You could do this (but please don't!)

```python
class self:

    @classmethod
    def reflection(klass):
        return str(klass.__name__[::-1])

    def __init__(I):
        I.feeling = 0

    def esteem(this):
        this.feeling += 1
```
