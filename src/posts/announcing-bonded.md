---
title: Announcing Bonded
description: Some thoughts on the creation of bonded
feature_image: /img/warehouse.png
date: 2023-03-24
tags:
  - python
layout: layouts/post.njk
---

This week I was able to publish the first two beta releases of bonded on [PyPI](https://pypi.org/project/bonded/) thanks in part to some extra time I had attending PyCascades.

Much of the effort was put into expanding the examples file. I originally created the examples file as a sort of hybrid integration and UI testing for myself. Real projects have complex dependencies, with organically grown sets of requirements. I didn't want to make up pretend projects to test bonded. I could have made pristine examples that followed every best practice; I could have made atrocities that no one would rightly want in their site-packages. But to solve real-world issues faced by projects I wanted to have real-world examples.

I think I was successful in that I was able to reduce the number of required options for my original examples and still get passing checks. I wanted projects adopting bonded to be able to do so with as little configuration as possible and start to see benefits right away. And I was able to achieve my other goal for creating based on real projects: I was able to [open the first issue found by bonded](https://github.com/Textualize/rich/pull/2884).


As a bit of a bonus, I also found an [issue in importlib_metadata](https://github.com/python/importlib_metadata/pull/432), which is a library that makes bonded's work much easier.
