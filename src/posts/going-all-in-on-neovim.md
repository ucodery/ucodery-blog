---
title: Going All in on Neovim
description: How I moved from running nvim in bash to running bash in nvim
feature_image: /img/nvim-ception.png
date: 2023-02-02
tags:
  - vim
layout: layouts/post.njk
---
After [NeoVimConf 2022](neovimconf-2022) I decided to go all in with Neovim as my [Personal Development Environment](https://www.youtube.com/watch?v=QMVIJhC9Veg). For me, this means Neovim needs to morph into something that is not just where I write all my code, but also where I run all my code.

So I changed my terminal's entry point from bash to neovim and so far it’s going great (as long as I remember to never ^Z in neovim and leave the terminal without an awake process. I need to nerf that command). But editing files while in a terminal buffer is awkward as it opens neovim within neovim.

Time for some client side communication. 

When originally choosing neovim I had no use for a server client architecture. I choose it as an editor for many reasons but primary among them was its terminal emulation. Now I see the two work beautifully together as it allows me to control my neovim session from within my shell while remaining in terminal mode.

As a fist pass at a solution I created a simple alias that `nvim` means `nvim --server $NVIM --remote-silent`. This was a great way to make the current terminal window display any file my bash can compute. As a bonus it also already works with multiple files.

However my current working terminal buffer becomes hidden which is annoying me. It's what I would expect if I was going from bash into neovim rather than bash back out to neovim, but not what I want in this case. An even though it works with one or more files, it doesn't yet handle no files. I’ll fix that in a bit. 

There is also the big issue of relative paths in my shell not matching relative paths from nvim. For now I need to work only with absolute paths

These are all annoyances, but I have a more immediate problem. Things aren’t going so well when programs try to use my `$EDITOR` and this new alias. The new command isn’t blocking; it returns success almost immediately. meaning that the invoking parent process thinks it is done immediately. This is great when I just want to pass a file off to a new buffer and get on with my bashing but in the case of git this means git thinks that commit messages are always empty and deletes the temp file before it even opens for me. 

So I need a replacement to nvim that won't hide my working terminal window, work with 0 to many files, automatically expands paths relative to the terminal's working directory and can either be blocking or non-blocking. That’s fairly complex, more than just an alias can do. This is going to require a more native solution as a bash function.

I'll start by just converting my alias into a function. I'll give it a new name, partly to be able invoke `nvim` directly when I need it, but also to avoid infinite recursion.
```bash
edit () {
  nvim --server $NVIM --remote-silent "$@"
}
```

This works, but I haven't fixed any of my issues with the alias yet. My biggest pain is that this alias-now-function doesn't block in some cases when I need it to. I am going to make this behavior switch base on an environment variable because I want all arguments and options to pass through to Neovim. When looking at how to implement this blocking behavior I found the very helpful Neovim option `--remote-wait`, however, although it is [documented](https://neovim.io/doc/user/remote.html) it is not yet implemented! The blocking logic will have to be outsourced to bash as well, at least for now.
```bash
edit () {
  nvim --server $NVIM --remote-silent "$@"
  if [ -z "$EDIT_WAIT" ]; then
    local file=$1
    if [ -e "$file" ]; then
      local t=$(date -r $file)
      while [ "$t" == "$(date -r $file)" ]; do
        sleep 0.25
      done
    else
      until [ -e "$file" ]; do
        sleep 0.25
      done
    fi
  fi
}
```

Next, I'll tackle the relative path problem. With the current solution relative paths will work, until my bash working directory changes. It is easier and safer to always pass absolute paths to `nvim`.
```bash
edit () {
  local files=()
  for f in "${@}"; do
    files+=("$(realpath "$f")")
  done
  nvim --server $NVIM --remote-silent "${files[@]}"
  if [ -z "$EDIT_WAIT" ]; then
    local file="${files[0]}"
    if [ -e "$file" ]; then
      local t=$(date -r $file)
      while [ "$t" == "$(date -r $file)" ]; do
        sleep 0.25
      done
    else
      until [ -e "$file" ]; do
        sleep 0.25
      done
    fi
  fi
}
```

Now a quick fix so that an empty files array doesn't produce an error. Rather than return without doing anything, I am opening a scratch buffer in the same way that would happen if `nvim` was executed without arguments. The option `--remote-send` will only work if a Neovim server is already running, unlike the option we've been using so far which can fall back to starting a new server. This is not a problem for me as by now I have committed to Neovim first terminals.
```bash
edit () {
  if [ $# -eq 0 ]; then
    nvim --server $NVIM --remote-send "<C-\\><C-N>:enew<CR>"
    return
  fi
  local files=()
  for f in "${@}"; do
    files+=("$(realpath "$f")")
  done
  nvim --server $NVIM --remote-silent "${files[@]}"
  if [ -z "$EDIT_WAIT" ]; then
    local file="${files[0]}"
    if [ -e "$file" ]; then
      local t=$(date -r $file)
      while [ "$t" == "$(date -r $file)" ]; do
        sleep 0.25
      done
    else
      until [ -e "$file" ]; do
        sleep 0.25
      done
    fi
  fi
}
```

This function now solves the failure modes my alias had, but the visual annoyance of my terminal window disappearing is still present. This is another case of behavior that I want configurable based on whether I am using it directly or indirectly (git reading my `$EDITOR`) which means another environment variable. It's a little clunky, but I don't want to get in my own way of editing a file by any name. The `neovim` option I have been using can take a single command which could be used to split the current window before opening files. Could, except it can't because this is one more case of a feature [documented](https://neovim.io/doc/user/remote.html#clientserver) but not yet implemented. As a workaround, I can send a two separate client commands to split and then edit some files.
```bash
edit () {
  if [ $# -eq 0 ]; then
    if [ -z "$EDIT_REPLACE" ]; then
      nvim --server $NVIM --remote-send "<C-\\><C-N>:new<CR>"
    else
      nvim --server $NVIM --remote-send "<C-\\><C-N>:enew<CR>"
    fi
    return
  fi
  local files=()
  for f in "${@}"; do
    files+=("$(realpath "$f")")
  done
  if [ -z "$EDIT_REPLACE" ]; then
    nvim --server $NVIM --remote-send "<C-\\><C-N>:split<CR>"
  fi
  nvim --server $NVIM --remote-silent "${files[@]}"
  if [ -z "$EDIT_WAIT" ]; then
    local file="${files[0]}"
    if [ -e "$file" ]; then
      local t=$(date -r $file)
      while [ "$t" == "$(date -r $file)" ]; do
        sleep 0.25
      done
    else
      until [ -e "$file" ]; do
        sleep 0.25
      done
    fi
  fi
}
```

There are a few more issues to make git happy. First, I need to pass along the `$EDITOR_WAIT` and `$EDITOR_REPLACE` environment variable without mutating our working environment. Also, git wants an executable, not a shell function. I can fix both by making an executable bash file that sources the function and sets the environment var. I could have alternatively exported the function definition, so that it is visible in bash script files but by explicitly sourcing the definition, this scrips will work independent of my rc files.
```bash
#!/usr/bin/env bash
source ~/.local/lib/edit.bash
EDIT_REPLACE=yes EDIT_WAIT=yes edit "$@"
```

With this new executable script placed on `PATH` either `git config --global core.editor` can be set or, for broader reach, export `$EDITOR` to point to this new command.