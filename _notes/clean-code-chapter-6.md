---
layout: post
title: Clean Code Chapter 6
---

## Data abstraction 

Consider these two code samples. Both represent the data of a point on the Cartesian plane, one exposes its implementation and the other hides it: 

```
var point = {
    x: null,
    y: null
}
```

```
var Point = function() {
    var x;
    var y;

    return {
        getX: function() {
            return x;
        }

        getY: function () {
            return y;
        }

        setCartesian: function(x, y) {
            x = x;
            y = y;
        }
        getR: function() {
        // Something to get R
        }

        getTheta: function() {
        //Something to get Theta
        }
        setPolar: function(r, theta) {
        // Set polar coordinates with r and theta
        }
    }
}
```

The cool thing about the second listing is thereno way to know if the implementation is in rectangular or polar coordinates. It might be niether! Yet it unmistakably represents a data structure. 

But it's more than just a data structure. The methods enforce an access policy. You can read the individual coordinates indepently, but you *must* set them together as an atomic operation. 

Hiding implementation is not just a matter of puttin ga lyaer of functions between the variables. Hiding implementation is about abstraction. A class doesn't simply push its variables out through getters and setters. It exposes abstract interfaces that allow its users to manipulate the *essence* of the data, without having to know the implementation. 

We don't want to expose the details of our data. Rather, we want to express data in abstract terms. It's not just accomplished by using interfaces and gettters/setters. Serious thought needs to be put into the best way to represent the data an object contains. The worst option is to add getters and setters with no real thought. 

## Data/Object Anti-Symmetry

These two examples show the diffrence between objects and data structures. Objects hide their data behind abstractions and expose functions to operate on that data. Data structrues expose their data and have no meaningful functions. 

This is important. Internalize it. It may seem like a trivial difference, but it has wide-reaching implications.

Considerthis example. The `Geometry` class operates on the three shape classes. The shape classes are simple data structures without any behavior. All the behavior is in the `Geometry` class. 

```
var Square = function() {
    var topLeft;
    var side;
}

var Rectangle = function() {
    var topLeft;
    var height;
    var width;
}

var Circle = function() {
    var center;
    var radius;
}

var Geometry {
    const pi = 3.141592;

    return {
        area: function(shape) {
            if (shape instanceof Square) {
                s= shape; 
                return s.side * s.side;
            }
            else if (shape instanceof Rectangle) {
                r = shape;
                return r.height & r.width;
            }
            else if (shape instanceof Circle) {
                c = shape;
                return pi & c.radius * c.radius;
            }
        }
    }
}
```

Object oriented programmers may complain that this is procedural. They're right. But consider what would happen if the `perimeter()` method was added to `Geometry`. The shape classes would be unaffected. Any other classes that depended on the shapes would also be unaffected. 

On the other hand, if we add a new shape, we must change all the functions in `Geometry` to deal with it. Notice that the two conditions are diametrically opposed. 

Now consider this object-oriented solution where the `area()` method is polymorphic. No `Geometry` class is necessary. So if we add a new shape, none of the existing functions are affected. But if we add a new function, all the shapes must be changed. 

```
var Square = function() {
    var topLeft;
    var side;

    return {
        area: function() {
            return side*side;
        }
    }
}

var Rectangle = function() {
    var topLeft;
    var height;
    var width; 

    return {
        area: function() {
            return height * width;
        }
    }
}

var circle = function() {
    var center;
    var radius;
    const pi = 3.14;

    return {
        area: function() {
            return pi * radius * radius;
        }
    }
}
```

Again, we see the complementary nature of these definitions. They are virtual opposites. It exposes the fundamental dichotomy between objects and data structures: 

> Procedural code (code that uses data structures) makes it easy to add new functions without changing existing data structures. Object Oriented code, on the otherhand, makes it easy to add new classes without changing existing functions. 

The complement is also true: 

> Procedural code makes it hard to add new data structures becasue all the functions must change. Object oriented code makes it hard to add new functions because all the classes must change.  

So things that are hard for OO are hard for procedures, and things that are hard for procedures are easy for OO. 

Mature prorammers know that the idea that everything is an object is a *myth*. Someties you really do want simple data structures with procedures operating on them. 

## The law of Demeter

The *Law of Demeter* says a module should not know about the innards of the *objects* it maniuplates. In the last section, we talked about how objects hide their data and expose operations. This means that an object should not expose its internal structure through accessors because to do so is to expose, rather than to hid, its internal structure. 

More precisely, the Law of Demeter says that a method `f` of class `C` should only call the methods of these: 

* C
* An object created by f
* An object passed in as an argument to f
* An object held in an instance variable of C

Talk to friends, not to strnagers. This code may violate the law: 

```
outputDir = ctxt.getOptions().getScratchDir().getAbsolutePath();
```

This knid of code is often called a *train wreck* because it looks like a bunch of coupled train cars. It's best to split them up. 

## Hybrids

This confusion sometimes leads to unfortunate hybrid structures that are half object and half data structure. They have functions that do significant things, and they also have public variables or public accessors/mutators that make privae variables public. 

Such hybrids make ithard to add new functions but also make ithard to add new data structures. They are the worst of both worlds. Avoid them. They are indicative of a muddled design whose authors are unsure of - r worse, ignorant of - whether they need protection from functions or types. 

## Hiding structure

What if `ctxt`, `options`, and `scratchDir` are objects with real behavior. Then, because objects are supposed to hid there internal structure, we should not be able to navigate through them. 

How would we get the absolute path of the scratch directory? 

`ctxx.getAbsolutePathofScratchDirectoryOption();`

or 
`ctxt.getScratchDirectoryOtpion().getAbsolutePath()`

The first option may lead to an explosion of methods in the ctxt object. The seconds assumes that `getScratchDirectoryOption()` returns a datastructure, not an object. Neither feels good. 

If ctxt is an obejct, we should be telling it to *do something*. We shouldn't be asking it about its internals. Why did we want the absolute path of the directory? What are we going to do with it? Consider this code from the same module: 

```
var outFile = outputDir + "/" + className.replace('.', '/') + ".class";
var fout = new FileOutputStream(outFile);
var bos = new BufferedOutputStrema(fout);
```

The intent of getting the absolute path of the scratch directory was to create a scratch file of a given name. 

So what if we told the `ctxt` object to do this? 

`bos = ctxtcreateScractFilesStream(classFileName)`

That seems like a reasonable thing for anobject to do! this allows ctxt to hide internals and prevents the current function from having to violate the Law of Demeter by navigation through objects it shoudln't know about.

## Data transfer objects

The quintessential form of a data structure is a class with public variables and no functions. It's sometimes called a data transfer object, or DTO. They're useful when communicating with databases or parsing messages from sockets and so on. They often become the first in a series of translation stages that convert raw data in a database into objects in application code.

Somewhat more common is the "bean" form. Beans have private variables manipulated by getters and setters. The quasi-encapsulation of beans seams to make some OO purists feel better but usually provides no other benefit. Observe: 

```
var Address = function() {
    var street;
    var streetExtra;
    var city;
    var state;
    var zip;

    return {
        address: function(street, streetExtra, city, state, zip) {
            this.street = street;
            this.streetExtra = streetExtra;
            this.city = city;
            this.state = state;
            this.zip = zip;
        },
        getStreet: function() {
            return street;
        },
        getStreetExtra: function() {
            return streetExtra;
        },
        getCity: function() {
            return city;
        },
        getState: function() {
            return state;
        },
        getZip: function() {
            return zip;
        }
    }
}
```

## Active record 

Active Records are special forms fo DTOs. They are data structures with public (or bean-accessed) variables. They typically have navigational methods like `save` and `find`. Typically they are direct translations from database tables or other data sources. 

Unfortunately, developers often try to treat these data structures as they were objects by putting business rule methods in them. It's awkward because it creates a hybrid between a data structure and an object. 

The solution is to treat the Active Record as a data structure and to create separate objects that contain the business rules and hide their internal data (which are probably just instances of Active Record).

## Conclusion 

Objects expose behavior and hide data. This makes it easy to add new kinds of objects without changing existing behaviors. It also makes ithard to add new beahviors to existing objects. Data structures expose data and have no significant behavior. This makes it easy to add new behaviors to existing data structures but makes it hard to add new data structures to existing functions. 

In any given system we will sometimes want the flexibility to add new data types and so we prefer objects for tha tpart of the system. Other times we will want flexibility to add new behaviors, so in that part of the system we will prefer data types and procedures. Good software developers understand these issues without prejudice and choose the approach that is best for the job at hand. 