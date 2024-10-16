---
title: Get Off My Lawn Apple
description: Removing bloatware in my dev environment
feature_image: /img/fake-python3.png
date: 2024-10-16
layout: layouts/post.njk
---

# Get Off My Lawn Apple

I recently got a new macbook from my employer and needed to set it up so I could perform my coding duties. It was going fine as I installed my minimum software requirements, and cloned my dotfiles. But I started getting weird errors whenever I drifted away from my core projects.

To my complete shock, my new computer came with binaries, shipped in the new base install, that don't do anything except raise an error asking you to install command line developer tools. Not only do these commands not do anything but return an error and spit stderr at me, they also make a new window appear to ask me a second time if I want to install these missing command line developer tools. *Even when the invoking process was not attached to a tty, or in the forground of a process group*. It's like trying to work on a machine infected by a 90's virus with popups flying at me all the time.

In the past, developing with a company macbook, I have installed xcode-lite and even xcode-giga-heavy. But this time, with a fresh machine I decided to take a fresh approach and manage my entire dev stack explicitly and declaratively using a system package manager. I don't need any of Apple's tools to do my job. And I especially don't need fake tools that advertise installing a huge corporate controlled dependency. 

But these fake tools all seem to live in `/usr/bin` _quite the fundamental PATH location_.

## How to find what binaries are real and which are fake?

I needed to survey the extend of the infection. How many of the tools installed for me in a fundamental part of my system were there purely as a marketing ploy and throwing errors whenever they were attempted to be used appropriately?

### match errors

If I run a fake program, it prints out a message to stderr. Great, I'll grep on the stderr of all binaries and count the matches. Except the stderr message doesn't appear unless it's attached to a tty. I could probably fake a stderr tty with `expect`. But that sounds like a lot of work. Also, this would involve actually launching each program, both the fakes and the real ones and I don't really want to run all those real programs and have an unknown 900-some actions take place on my system. I don't know any command that will launch any random binary and also guarantee that it does no work, and I don't want to destroy my system just to count some fake tools.

I need a different approach.

### count error windows

Maybe I could run all the commands and count how many popup windows Apple spawns? Very low tech, and not scriptable, but it I can do it once. Except all errors share one window, and don't even override the message within. I'm not going to sit here and close each one by one while counting. Also, this would again mean executing all binaries, which could unleash untold chaos on my system.

Not this.

### inspection without execution

Doing some binary delving, I found that all of the known-to-me fake binaries have a call to `com.apple.dt.xcode_select.tool-shim`, which is a pretty promising name. And searching the program bytes as a file isn't going to execute it, so this feels much safer. This worked surprisingly well and running `for b in /usr/bin/*; do if grep -q 'com.apple.dt.xcode_select.tool-shim' $b; then echo $b; fi; done` reports 77 fake binaries. So far as I can tell, every one is an identically fake executable.

Now to remove them.

## How to remove fakes

### Delete

This part of MacOS is protected, not for no reason. So deleting the fakes is not possible
```
$ sudo rm -f /usr/bin/python3
rm: /usr/bin/python3: Operation not permitted
```

### Disable Execution

Still not allowed
```
sudo chmod -x /usr/bin/python3
chmod: Unable to change file mode on /usr/bin/python3: Operation not permitted
```
I even reboot into recovery mode, disable SIP, macOS's system integrity protection, and try again. Still not permitted.

As it turns out, these command live on a disk that is mounted Read-Only, and that disk is then mounted so that it covers `/usr/bin`. In recovery mode, these commands do not exist, as a more stripped-down directory exists at /usr this early in the boot process. (one that contains no fake tools, because they are not in fact useful for administering a system).

### File Systems Are Wonderful

Well two can play games with mounts, Apple!

I know that certain type of file systems can be mounted from one local directory onto another. And that there are mount options that can merge the files in the above directory with the ones below; so it acts more like a set union than a reassignment. I also know that some of these setups even allow whiteout files, essentially deleting the file from the view of the system, while not actually removing the file in the underneath directory. Even if that wasn't possible, I could at least replace the fake tools with programs that did nothing in a much less invasive way. I was looking to bind- and union-mount a local filesystem, hopefully one like nullfs.

Except nullfs isn't a thing on macOS (or even Linux). But I know NFS can do bind and union mounting, and NFS is already available in macOS. So I should be able to use that. I set up a rather permissive localhost export. Then test that I can in fact bind mount from A to B. Now to overlay /usr/bin.
```
# mount -o union localhost:/Users/jeremyp/mnt/usr/bin /usr/bin
mount_nfs: can't mount /Users/jeremyp/mnt/usr/bin from localhost onto /usr/bin: Operation not permitted
mount: /usr/bin failed with 1
```

No good.

### (Ab)using the Native System Solution

When researching an alternative filesystem that might work I discovered how macOS was doing its own system of mounts during boot that initially gave me trouble. They are seemingly called firmlinks, and new ones can be defined in /etc/synthetic.conf. However, it turns our I couldn't use this feature as only entries at `/` can be added, and I don't want to override all `/usr` just `/usr/bin`. Plus macOS is already using that mound point and synthecic documents that multiple entries pointing at the same location is undefined behaviour.

### Bypass the Kernel

Maybe a user-space filesystem will work?

Looking around the internet, there are not a lot of FUSE filesystems that support macOS and union. I do find one in my package manager [unionfs-fuse](https://github.com/rpodgorny/unionfs-fuse).
Although the latest version has a broken build, so I have to install a historical version.

Oh, and it seems to not bring in its dependency on macFUSE when used on a Darwin system.
So I have to download that separately, outside of my package manager (and deal with macOS blocking 3rd party system extensions by default)

I take the plunge, and add macFUSE to my system.

Fast-forward past many reboots and fiddling with my machine's recovery settings, I have the FUSE kernel extension working.


```
$ unionfs  /Volumes/Macintosh\ HD/usr/bin:/Users/jeremyp/mnt/usr/bin /usr/bin
mount_macfuse: failed to mount /usr@/dev/macfuse0: Operation not permitted
fuse: mount failed with errro: 1
```

I am starting to get annoyed.

## Enter Hard Mode

I said before that /usr/bin (actually /) was already a mount from some other directory. I had found that the final mount, overlaying and hiding several previous, comes from  `/Volumes/Machintosh HD/`, which is my primary system partition.

I want these fake programs gone from _there_. But the mount is Read-Only. So I re-enter recovery mode, the closest thing to single-user-mode I have. I unmount the disk, then re-mount it in rw mode in a temporary place. I check one of the fake programs, `usr/bin/python3`, under the new mount-point and confirm it is the bad python. I delete this file, no errors. I unmount the disk and remount the partition at root using Disk Recovery. I verify the bad python is still gone! I reboot machine and check `/usr/bin`. The bad python is back!!!! (ノÒ益Ó)ノ彡▔▔▏

## OKAY FINE APPLE

### It's MY Environment

I am forced to admit defeat. Filesystems are super cool and already contain all the tools to fix my problem. But because every `mount` eventually does have to go through the kernel, I cannot force macOS to accept my solution. I must implement a purely userspace solution. I need the fake programs out of my PATH. Out of every PATH that is ever set.

But there are nine hundred other binaries in that folder that I or some software I want to use may need. Probably I could supply all of them as user-installed packages. Maybe that would be better, but I'm lazy and I also don't want to fight random failures as workflows I had been using now break. Any software that I may want to run, my IDE running a sidecar, a cron job, testing out another shell, I need the fake tools out, but can't guarantee none of them rely on some specific working tool in `/usr/bin`.

### Skip over fakes

As a bash user, I know I can remove individual executables with the `hash` builtin, redirecting the lookup before PATH is even consulted. Neat, but bash-specific so generally workable for me, but not universally so. Plus `hash` is reset after every PATH assignment, so it is not only a matter of un-hashing these commands once when opening a shell, but catching every change to PATH anywhere. Doesn't sound workable to me.

I could making a function or alias for every fake tool. This solution would also have to be reimplemented on every shell invocation, and is also still bash-specific, but it would have the advantage of sticking as long as that bash session was running. However, I do want to use these tools in some places. I just don't ever want to use the version in`/usr/bin`. If I alias all the fake tools, I have no way to use a good version from my package manager. Also, I want the solution to apply to non-shell processes as well.

### Unload /usr/bin

My last choice; time to find and purge `/usr/bin`. FOR EVERY process!

But, I still want the real binaries to be available. So I will create a new directory with links to the working binaries, but skip those that are fake. Hardlinks are out, because the target files are RO and I can't add to their link count so symlinks it is.

Not to give PATHs the ol' switcheroo.

I start with `/etc/paths`; replacing `/usr/bin` with my new directory of good links. I start a new terminal and check my PATH. I still see `/usr/bin`. But it does move it from 5th position, where the other `/etc/paths` entries are, down to 13th. Something else later in the shell start up is adding it, probably with a check for existing earlier.

Next, replace the entry in `/etc/rc.common`. In a new terminal I still see the undesirable dirtying my PATH.

My final act of resistance: I add a find-and-replace of `/usr/bin` within PATH in my shell rc, so at least for my own sessions, this unwanted visitor is truly purged.

## Happily Ever After, I Guess

Since I have made this correction to my system, I have not seen any further attention-grabbing popups trying to hook me on further buy-in to the Apple ecosystem. I'm not really happy with my solution, but it appears to be holding back the undesirables. For now.
