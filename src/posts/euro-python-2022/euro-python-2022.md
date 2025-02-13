---
title: EuroPython 2022
description: recap
feature_image: ./europython2022.png
feature_image_description: EuroPython 2022 logo
date: 2022-11-23
tags:
  - python
  - conference
---

# EuroPython2022

In July 2022 I attended EuroPython virtually. While it was held in person this year, they had a remote venue as well and when my travel plans got stuck they let me switch to present virtually, which was a relief. In addition to the always-present topics at Python conferences such as web or data science, harmful AI was also a front-and-center theme.

## Killer Robots Considered Harmful

A mostly chilling talk about how and when armed forces apply deadly force, especially when using autonomous weapons. When can a computer decide to launch an attack and how much of the decision, if any, does a human need to sign off on?

## Dodging AI Dystopia: you can't save the world alone

Another non-technical talk about a potentially dark future. This one focuses on how developers will need to approach new AI social problems legally and morally. In the same way that GDPR changed user data, new legislation happing now is changing how AI will be able to be applied.

## Design of Everyday APIs

A wonderful talk about designing APIs as intuitive to the users, and how to give the user the same mental model of the interface that the programmer has, with no further communication past the interface.

## Protocols in Python: Why You Need Them

The new Protocol type received a lot of attention and this talk compares its use to existing ways of typing in Python, including the pros and cons of the various styles of typing.

If you are looking for another good overview of Protocol, the talk typing.Protocol: type hints as Guildo intended gives a bit more theoretical introduction to the new type.

## How we are making Python 3.11 faster

From Microsoft's faster Python team. A very technical talk on how they achieved their first 25% speedup of the core language by going over changes to core data structures and algorithms in extreme detail. It also introduces the specializing adaptive interpreter, which will continue to drive most of the python speed improvements post version 3.11.

## Multithreaded Python without the GIL

This is a project to remove the GIL from CPython. It is not the first project attempting to remove the GIL, not by far, but it may become the first fully successful one. Given by the primary author of the nogil project, it contains a lot of low-level details of changes within CPython. It looks very successful already, the author got scikit-learn working in his fork.

## Packaging security with Nix

An introduction to the Nix packaging system, what it is, why it exists, and how to get started using it as a Python developer. Nix has been consistently showing up at Python language conferences; it seems the community is interested in secure package managers.

## Building a JIT Python FaaS Platform with Unikraft

This was my first introduction to unikernels, which are a bit like slim docker builds but the produced binary can run directly on bare metal or a kvm. The final program is not only smaller but much faster as there is no kernel/ userspace separation and thus no syscalls.

## Implementing PEP-458 to Secure PyPI downloads

A very technical deep dive into what implementing PEP-458 “Secure PyPI downloads with signed repository metadata” and PEP-480 “Surviving a Compromise of PyPI: End-to-end signing of packages” actually took, by the developers who did it.

## Packaging Python in 2022

I revamped this talk I’ve given before to focus on how to use python packaging tooling and how to integrate each with the now ubiquitous pyproject.toml. By following along with the simple commands that fit one slide, a viewer could upload their own Python module to pypi.org.
