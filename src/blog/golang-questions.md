---
layout: post
title: 
tags: 
description:
date:
---

How do I take input from a command line and turn it into a number? 

I can do something like [this Stack Overflow comment suggests](https://stackoverflow.com/a/20895629):

```go
package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Enter text: ")
    text, _ := reader.ReadString('\n')
    fmt.Println(text)
}
```

Then I can use [Atoi](https://golang.org/pkg/strconv/#Atoi) to convert, like this: 

```go 
package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Enter text: ")
    text, _ := reader.ReadString('\n')
    number, _ := strconv.Atoi(v)
    fmt.Println(text)
}
```
But that doesn't work, I get `0` from `25`. 

Turns out, `text` comes back including `\n`. 

[This Stack Overflow post](https://stackoverflow.com/a/44448443) suggests using the [TrimSuffix](https://golang.org/pkg/strings/#TrimSuffix) function from the Strings package to trim the `\n`. 

That works! 

```go 
package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
    "strings"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Enter text: ")
    text, _ := reader.ReadString('\n')
    text = strings.TrimSuffix(text, '\n')
    number, _ := strconv.Atoi(text)
    fmt.Println(text)
}
```