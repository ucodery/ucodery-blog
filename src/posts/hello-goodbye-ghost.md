---
title: Hello Goodbye Ghost
description: a quick 
date: 2022-11-22
tags:
  - blogging
  - draft
layout: layouts/post.njk
---

I have no idea what I am doing on the front end.
But I have always wanted to start my own blog. My ideas list of things I would post, if I did have a blog started to reach a critical mass.
I had no idea where to start, but knew I probably wanted a static site. They seem to be fashonable with frontend devs that I follow, and ostensible don't require any javascript knowledge (more on that later). I don't know how to write good javascript, but I know enough to get things done in HTML and CSS.
But there is a lot more to choose, and I had even less idea about most of those as well. the package manager (because it turns out you need a bit of js to build the static site), the template engine (engines??) the markdown language, ideally a local build+host option, a CMS, a cloud host (always though I would self-host, but realized that was a big reason holding me back), and edge provider. There are all choice some people probably have strong and well-reasoned optionions about; those people probably don't have to look up the definigion of CMS every time they read it, or go to StackOverflow to learn how to write a javascript if statement.

Hugo was right out based on work.

I started with Nikola. Great, its static, its mostly Python, where I feel cozy, and it has a lot of plugins. But it has only a few themes, and once you leave the two or three suggested ones, most of the plugins don't actually hook into your pages (goodbye search bar, goodbye Table of Contents). So I re-wrote some plugins and wrote some new ones, but it so quickly felt like a huge mountain of code I was holding over my head. And I still had nowhere to host it.

Now I decided I was going to go with Netlifly. Only because it was one of about 4 names that I wrote down as I listened to devs speak about static site services they like.

the first hit on a search engine was Netlifly + Ghost + eleventy
It looked beautiful. It has all the types of formatting I wanted and not much more. It looked beautiful. It didn't have a phone app, but it is a PWA and useing it felt so good; I was going to write so many posts with this service.

but then I found out its themes don't translate over to a static site. Not even the base one. So I had to maintian that myself.
then I found out that none of the cards translate ove rto a static site. So I would have to re-create them or not use any cards.
So why am I using Ghost at all??
there is a lot of friently help, in GH or the forums, or email. But I am doing all the work myself.

So ditch Ghost and just do Netlify + eleventy. Its just what I want
