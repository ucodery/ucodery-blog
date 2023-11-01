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

Python has keywords. These are words that have special meaning in Python programs, like `class`, `if`, and `None`. You can't use these names for your variables anywhere.

Keywords are a type of reserved word, or a name that a programming language has removed from the choice of otherwise legal variable names. Unlike some other lanaugages, Python uses all its reserved words as keywords. This means that every word that is taken out of use as a name has a spcific meaning to the language. (Other than dunders, the infinite set of which are reserved).

If you want to know the complete list of Python's keywords you can ask Python itself.
```python
import keywords
print(keywords.kwlist)
```

Recently, Python has also gained soft keywords. Thse are keywords that are not also reserved words. This means that `match` can sometimes have special meaning to the language, but at the same time be used for variable names.
You _could_ do this (but please don't!)
```python
match = "name"
match match:
    case str(case):
        print(f"{case!r}")
    case int(case):
        print(42 + case)
```

However, did you know that Python also has convention words? These are variable names that are used as if the language requires it purely out of convention, but it is not mandated.

The first of these convention words is `_`. This name is often used to indicate "don't collect this value". But unlike some other languages, the value _is_ still captured and the `_` name is bound. (Although for `match` statements it _does_ have a special meaning).
```python
front, _, back = "cheese-shop".partition("-")
print(_)
```

args, kwargs

Maybe the most suprising of Python's convention words is `self`. The first paramater name of a method does not need to be `self`. In fact any variable anywhere can be named self. And the same goes for `cls` in classmethods. However, be warned, as this is the strongest of all the conventions you will only sow confution by straying from it.
You _could_ do this (but please don't!)
```python
class self:

    def mutate(this, other):
        for field in dir(other):
            if hasattr(this, field):
                setattr(this, field, getattr(other, field))
```
