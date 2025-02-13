---
title: PyCon 2022
description: recap
feature_image: ./pycon2022.png
feature_image_description: PyCon 2022 logo
date: 2022-06-14
tags:
  - python
  - conference
---

# PyCon US 2022

The first in-person Python conference in three years! It was nice to be back even if the event wasn't quite at previous sizes. Python in the browser was the biggest reveal and probably ignited the most discussion, even weeks after the closing session. Also the new buzzword of supply chains has spawned a whole host of new tools, businesses, standards, and talks.

## Łukasz Langa

Python's developer-in-residence kicked off this year's conference. His talk focuses on type annotations which can cause a lot of controversy, even among the core team. Łukasz is firmly in the pro-annotations camp and tries to recruit more to his side here, but still offers a fair review of the current state of python typing.

## Peter Wang

This was the reveal of pyscript. If you don't know by now, pyscript is a way to embed python in HTML. Pyscript has made it nearly effortless to in-line some python on your web page.

## Handling Timezones in Python

Handling time is always a hard problem, even if it doesn't always feel like it. Not stopping to consider the complexities of time handling because the simple cases seem simple will often lead to bad bugs in the future. This talk is full of precise and applicable best practices for writing time-aware code in Python.

## Write Docs Devs Love: Ten Tips to Level Up Your Tech Writing

Great tips about why writing good documentation is good for your project. Then a series of short, actionable, usable advice on how to produce good technical writing.

## Securing the Open Source Software Supply Chain

Supply Chain is the new catch phrase of the software industry. This talk will explain what a software supply chain is and why it is more relevant now than ever. SLSA, OSV, sigstore, executive order 14028, and many many more ideas defined and given context for developers.

## Bad Actors vs Our Community

Now that the idea of supply chains is a bit clearer, this talk goes over several ways bad code can be injected into supply chains that are not secure. A combination of techniques and tools is needed by developers who want to secure their builds. The techniques presented to catch malicious code have already been put into practice to actually identify and takedown several dozen malicious PyPI packages.

## Building a python code completer

A great intro to grammar and ASTs. This half-hour talk really does go through almost all the steps necessary to create an impressive predictive code completer for Python using Python.

## Fast and reproducible tests, packaging, and deploys

This is a high-level overview of the Pants build system. It seems like a useful tool for large Python projects. It also presents the goals and eventual benefits a project can reap from adopting a holistic build system.

## Tools for Data Privacy

A very interesting approach to securing private data. The library demonstrated allows data privacy to be tested and deployed as code, seemingly inspired by infrastructure-as-code.

## Intro to Introspection

Wrapping up the sessions is my own. It is generally a tour of dunder magic attributes and how much better it is to work with the inspect module rather than these private attributes directly to answer any question you may have about an object.

## Must See Lightning Talks

Future of trust stores in Python: Python finally has a way to use system certificates

let's secure your PyPI account: 2FA is becoming expected practice but there is more than one way to do it

Memray: is this the new de-facto Python profiler?

Pepdocs: PEPs in the terminal

Semgrep: A language-agnostic static analysis tool, used here to lint media files

## Other PyCon Follow-ups

[The 2022 Python Language Summit](https://pyfound.blogspot.com/2022/05/the-2022-python-language-summit_01678898482.html)

[Python Packaging Summit - PyCon US 2022](https://hackmd.io/@gaborbernat/py-packaging-summit-2022)
