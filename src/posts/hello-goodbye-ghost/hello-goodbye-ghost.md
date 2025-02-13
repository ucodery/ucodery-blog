---
title: Hello Goodbye Ghost
description: a getting started story
feature_image: ./ghost-eleventy.png
feature_image_description: The 11ty and Ghost logos conatained within separate but overlapping circles
date: 2022-11-22
tags:
  - blogging
---

I have no idea what I am doing building this website.

But I have always wanted to start my own blog. The list of ideas I would post if I had one has started to reach a critical mass.

I have no idea where to start but know I want a static site. They seem to be fashionable with frontend devs that I follow and ostensibly don't require any javascript knowledge (not really; I feel like no js web is a lie, even when it doesn't make it to the final site). I don't know how to write good javascript, but I know enough to get things done in HTML and CSS. But there is a lot more to choose from than one or two languages for building.

I have even less idea what I am doing with those tools and there are so many: the package manager (because it turns out you need a bit of js to build even the static site), the template engine (engines??) the markup language, ideally a local build+host option, a CMS, a cloud host, and edge provider. These are all choices others probably have strong and well-reasoned opinions about; those people probably also don't have to look up the definition of CMS every time they read it or go to StackOverflow to learn how to write a javascript if statement. I am just picking parts based on discoverability and how they make me feel.

I started with Nikola. It seemed great. It's static, it's mostly Python, where I feel cozy and safe, and it has a lot of plugins. But it has only a few themes, and once you leave the two or three suggested ones, most of the plugins no longer hook into your pages (goodbye search bar, goodbye table of contents). So I re-wrote some plugins and wrote some new ones, but it so quickly felt like a huge mountain of code. And I still had nowhere to host it.

So back to square one and I decided I needed to select a hosting service first. I had always thought I would self-host, but after years of turning over the idea of blogging in my head, I realized that idea was the biggest obstacle holding me back. Since I don't have any hardware ready to serve, I would have to first design and obsess over that project before I could even begin to write anything. Instead, I chose to go with Netlify. Devs that I have heard speak about such things seemed to like the service, and their developer experience has been great since day one.

Now I had to return to the problem of choosing a site builder. The first hit on a search engine was Netlify + Ghost + eleventy. It looks beautiful. Ghost has all the types of formatting I want and not much more. I could start writing right away and with its progressive web app, I could even do some drafting while on the go. I was going to write so many posts with this service.

At this point I had written several posts, I had customized the look, and I wanted to get my blog out there. I needed to publish. Luckily there was an example project and blog post from Ghost that took the site as written in the service, turned it into a static site with eleventy, and pushed it to Netlify. I got the entire build and deploy job working after only a few hiccups. I even managed to modify the build process to inject a mastodon badge with a verified link to my fosstodon profile.

But then I found out Ghost's themes don't translate over to a static site. Not even the base one. So I began to maintain static versions of the Ghost themes myself. Then I found out that none of the cards translate over to a static site. So I had to re-create them, using javascript, or not use any cards.

At this point I asked myself, why am I using Ghost at all? I was rewriting everything I liked about the site's look and navigation on my own for eleventy. The Ghost site looks great, way better than anything I could come up with on my own. And there is a lot of friendly help, in github, in the forums, and even by email. But I am doing all the work myself once it gets to a static site.

So I ditched Ghost and went with just Netlify + eleventy. It's just what I want. And everything is saved in a git repo, no online services with some opaque operations, which is what I wanted from the beginning. It's a chore to implement every new feature, but I learn with every commit. This is the sort of adventure I want from my blog.

I have no idea what I am doing building this website. But I am starting to learn.
