# Git and GitHub Crash Course

There is a *lot* of depth to [Git](https://git-scm.com/) and [GitHub](https://github.com/). The good news is you really don't need to know it all to be very productive. Most software professionals only use a few key commands in their day-to-day. This document will go over those commands somewhat quickly. 

## Get a GitHub repository on your local machine

We'll use `git clone` for this.

1. Visit the GitHub repository you're interested in.
1. Above the list of files, click **Code**. 
1. To clone the repository using HTTPS, under "Clone with HTTPS", click the copy symbol. To clone the repository using an SSH key, click Use SSH, then click the copy symbol.
1. Open terminal 
1. Navigate to a folder you want to download the repository to 
1. Run this command: 

```
git clone text-you-copied-from-step-3
```

[Additional GitHub reference](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository)

## Make and track changes in the project

Open your project in whatever text editor or file browser you prefer and make some changes to it. Save the files in your text editor/on your hard drive.

Then, in the terminal, enter the project directory:

```
cd path/to/project
```

Add your changes to the git [staging area](https://git-scm.com/about/staging-area):

```
git add -A
```

Commit your changes to the branch: 

```
git commit -m 'a short descriptive commit message'
```

Push your changes back to the GitHub repository: 

```
git push
```

You'll need to be authenticated for this to work. One of the most convenient ways to authenticate is by [connecting to GitHub with SSH](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh). 

If you originally used the `https` link when you cloned the repository, you may have to [change the remote URL from HTTP to SSH](https://docs.github.com/en/free-pro-team@latest/github/using-git/changing-a-remotes-url#switching-remote-urls-from-https-to-ssh). 

## Branching - your new best friend

Git [branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) is basically *the reason* to use Git. With branches, you can experiment and make changes to your project without worrying about losing your current work.

To begin working with branches, you'll need to check out a new branch by running this command in the terminal (in the project directory):

```
git checkout -b new-branch-name
```

You can change back and forth between existing branches with the `checkout` command on its own. You only need to add `-b` when you're *creating a new branch*. 

```
git checkout main
git checkout new-branch-name
```

Once you're on the new branch, make your changes. Save them in your workspace, and then follow the same workflow for tracking changes: 

```
git add -A
git commit -m 'some short commit message'
```

If you want to bring your changes into the codebase, you'll want to create a [pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-requests). To do this, you'll have to push your changes to the GitHub repository from the terminal: 

```
git push -u origin new-branch-name
```

Then visit the repository's GitHub page. From there, you'll be able to follow [these steps for creating a pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).
