# Functions 

Functions are the first line of organization in any program. This chapter is about writing them well. 

Consider this long function which we will refactor: 

```
function testableHtml(pageData, includeSuiteSetup) {
    var wikiPage = pageData.getWikiPage();
    var buffer = '';
    if (pageData.hasAttribute("test")) {
        if (includeSuiteSetup) {
            var suiteSetup = PageCrawlerImpl.getInheritedPage(SuiteResponder.SUITE_SETUP_NAME, wikiPage)
            if (suiteSetup) {
                var pagePath = suiteSetup.getPageCrawler().getFullPath(suiteSetup);
                var pagePathName = PathParser.render(pagePath);
                buffer += "!include -setup ." + pagePathName + "\n";
            }
        }
        setup = PageCrawlerImpl.getInheritedPage("SetUp", wikiPage);
        if (setup) {
            setupPath = wikiPage.getPageCrawler().getFullPath(setup);
            setupPathName = PathParser.render(setupPath);
            buffer += "!include -setup . " + setupPathName + "\n";
        }
    }
    buffer.append(pageData.getContent());
    if (pageData.hasAttribute("Test")) {
        teardown = PageCrawlerImpl.getInheritedPage("TearDown", wikiPage);
        if (teardown) {
            tearDownPath = wikiPage.getPageCrawler().getFullPath(teardown);
            tearDownPathName = PathParser.render(tearDownPath);
            buffer += "!include -teardown . " + tearDownPathName + "\n";
        }
    }
    if (includeSuiteSetup) {
        suiteTeardown = PageCralwerImpl.getInheritedPage(SuiteResponder.SUITE_TEARDOWN_NAME, wikiPage);
        if (suiteTeardown) {
            pagePath = suiteTeardown.getPageCrawler().getFullPath (suiteTeardown);
            pagePathName = PathParser.render(pagePath);
            buffer += "!include -teardown ." + pagePathName + "\n";
        }
    }
    pageData.setContent(buffer);
    return pageData.getHtml();
}
```

This would be difficult to understand after three minutes of study. There's quite a lot going on at many different levels of abstraction. There are straing strings and odd function calls mixed in with doubly nested if statements. 

But with some metho extractions, renaming, and some restructuing, we can caputre the intent of the function in nine lines like so: 

```
function renderPageWithSetupsAndTeardowns(pagedata, isSuite) {
    isTestPage = pageData.hasAttribute("Test");
    if (isTestPage) {
        testPage = pageData.getWikiPage();
        newPageContent = "";
        includeSetupPages(testPage, newPageContent, isSuite);
        newPageContent.append(pageData.getContent());
        includeTeardownPages(testPage, newPageContent, isSuite);
        pageData.setContent(newPageContent.toString());
    }
    return pageData.getHtml();
}
```

You may still not understanda ll of the details, but you can likely grok that the function performs the inclusion of some setup and teardown pages into a test page and then renders that page into HTML. This iseasier to understand in the second example than the first. 

So what makes the second version easier to understand? How can we make a function communicate its intent? What attributes can we give our functions that allow a casula reader to intuit the kind of program they live inside? 

## Small

The first rule of functions is that they should be small. The second rule of functions is that *they should be smaller than that*. 

Our code example from before should really look like: 

```
renderPageWithSetupsAndTeardowns(pagedata, isSuite) {
    if (isTestPage(pageData)) {
        includeSetupandTeardownPages(pageData, isSuite);
    }
    return pageData.getHtml();
}
```

This implies that *blocks within `if` statements and other loops should be one line long*. That line should be a function call. Not only does this keep the enclosing function small, but it adds documentary value because the function called within the block can have a descriptive name. 

This also implies functions should not be large enough to hold nested structures. *The indent level of a function should not be greater than one or two*. This maeks functions easier to read and understand. 

## Do one thing 

The first example is doing lots more than one thing. It's creatin buffers, fetching pages, searching for inherited pages, rendering paths, appending strings, generating HTML. 

The most recent listing is doing one thing: it's including setups and teardowns into test pages. 

The following advice has appeared in one form or another for 30 years ore more: 

*Functions should do one thing. They should do it well. They should do it only.*

This statement can be hard because it's unclear what "one thing" means. Even in the third example, you could make the case it's doing three things: 

1. Determining whether the page is a test page
2. If so, including setups and teardowns. 
3. Rendering the page in HTML. 

So is the function doing one thing or three? Notice that these steps are one level of abstraciton below the stated name of the function. We can describe the function by describing it as a paragraph: 

> To RenderPageWithSetupsAndTeardowns, we check to see whether the page is a test page and if so, we include the setups and teardowns. In either case we render the page in HTML. 

If a function does only steps one level below the stated name of the function, then it's doing one thing. We write functions to decompose larger concepts into a set of steps at the next level of abstraction. 

Another way to know if a function is doing more than one thing is if you can extract another function from it with a name that is not merely a restatement of its implementation. 

### Sections within functions

If you have a function divided into sections, it is a symptom of doing more than one thing. *Although in functional programming like JavaScript, I personally think this may be unavoidable*. 

## One level of abstraction per fucntion 

Mixing levels of abstraction within a function gets confusing. Readers may not be able to tell whether a particular expression is an essential concept or a detail. Worse, once details are mixed with essential concepts, more and more details tend to accrete within the function. 

### The stepdown rule 

We want code to read like a top-down narrative. Every function should be followed by those at the next level of abstraction so we can read the program, descending one level of abstraction at a time as we read down the list of functions. This is the *stepdown rule*. 

This is a difficult process for many programmers. Staying at a single level of abstraction is important. It is the key to keeping ufnctions short and making sure they do one thing. 

## Switch statements 

It's hard to make a small switch statement. It's also hard to make a switch statement do one thing. By their nature, switch statements always do *N* things. We can't avoid switch statement,s but we can make sure each statement is buried in a low-level class and is never repeated. This can be accomplished with polymorphism. Consider: 

```
function calculatePay(employee) {
    switch (employee.type) {
        case: "commissioned":
            calculateCommissionedPay(employee);
            break;
        case: "hourly": 
            calculateHourlyPay(employee);
            break;
        case: "salaried":
            calculateSalariedPay(employee);
            break; 
    });
}
```

Here are the problems with the function: 

* It's large, and when new new employee types get added, it will grow. 
* It does more than one thing 
* It violates the Single Responsibility Principle because there is more than one reason for it to change 
* It violates the Open Closed Principle because it must chnage whenever new types are added. 
* The worst problem is that this function comes with an unlimited number ofother functions that will have the same structure, like checking for `isPayDay()` or `deliverPay()`, or any others. All of them would have the same kind of awful structure. 

The solution is to bury the `switch` statement in the basement of an *abstract factory*, and never let anyone see it. The factory will use the `switch` statement to create appropriate instances of the derivatives of `Employee`, and the various functions such as `caluclatePay()`, `isPayday()`, and `deliverPay()` will be dispatched polymorphically through the `Employee` interface. 

Generally, `switch` statements can be tolerated if they appear only once and are used to create poloymorphic objects, and are hidden behind an inheritance relationship so the rest of the system can't see them. Of course there are exceptions. 

*And when it comes to javascript, we may not have all these options available to us*. 

## Use descriptive names 

In a previous example, the author changed a function from `testableHtml` to `SetupTeardownIncluder.render`. It's a better name because it better describes what the function does. They also gave equally descriptive names to other functions. *It is hard to overestimate the value of good names*. 

Half the battle to achieving predictable code is choosing good names for small functions that do one thing. The smaller and more focused a function is, the easier it is to choose a descriptive name. 

Don't be afraid to make a long name. A long descriptive name is better than a short enigmatic name. A long descriptive name is better than a long descriptive comment. Use a naming convention that allows multiple words to be easily read in the function names, then make use of those multiple words to give the function a name that says what it does. 

Don't be afraid to spend time choosing a name. You should try several different names and read the code with each in place. Changing code names can be a trivial task in modern IDEs. 

Descriptive names will clarify the design of the module in your mind and help improve it. It is not uncommon that hunting for a good name results in a favorable restructuing of the code. 

Be consistent in names. Use the same phrases, nouns, and verbs in the function names. 

## Function arguments

The ideal number of arguments for a function is zero (niladic). Next comes one (monadic), followed closely by two (dyadic). Three arguments (triadic) should be avoided where possible. More than three (polyadic) requires very special justification, and shouldn't be used anyway.

Arguments are hard. They take a lot of conceptual power. When you use them across functions, readers have to interpret it each time they see it. 

Arguments are even harder from a testing point of view. You have to write test cases to ensure that all the various combinations of arguments work properly. If there are no arguments, this is trivial. If there's one, it's not too hard. The problem gets more challenging with two. With more, testing every combination of appropriate values is daunting. 

Output arguments are harder to understand than input arguments. When we read a function, we're used to arguments goin in to the funciton through the arguments, and out through the return value. We don't expect information to be going out through the arguments. Output arguments cause us to do a double take. 

One input argument is the next best thing to no arguments. 

## Common monadic forms 

Two common reasons to pass a single argument to a function: 

1. You are asking a question about that argument 
2. You are operating on that argument, transforming it into something else and *returning* it. 

A less common but useful form for a single argument function is an *event*. Ther is an input argument but no output argument. The program is meant to interpret the function call as an event and use the argument to alter the state of the system. 

## Flag arguments 

Flag arguments are ugly. Passing a boolean into a function is a truly terrible practice. It immediately complicates the signature of the method, loudly proclaiminng that this function does more than one thing. It does one thing if the flag is true, and another if the flag is false. 

Consider splitting this kind of function into two different functions. 

## Dyadic functions 

A function with two arguments is harder to understand than a monadic function. There are times, of course, where two arguments are appropriate. Perhaps: `p = new Point(0, 0)`. Cartesian points naturally take two arguments. 

In this case, the two arguments are *ordered components of a single value*.  

Even dyadic functions that feel obvious can be tricky. Consider: `asserEquals(expected, actual)`. The `expected, actual` ordering is a convention that must be learned and remembered, and may be goofed. 

Dyads aren't evil. You'll definitely have to write them. But they come at a cost and you should take advantage of any mechanism you have to convert them into monads. 

## Triads 

Functiosn that take three arguments are significantly harder to understand than dyads. The issues of ordering, pausing, ignoring params are more than dobuled. Think very carefully before making a triad. 

## Argument objects

If a function seems to need more than two or three arguments, it's likely some of those arguments should be wrapped into a class of their own. Consider a circle maker: 

```
function makeCircle(x, y, radius) {
    ...
}
```

which could probably be: 

```
function makeCircle(center, radius) {
    ...
}
```

Where `center` is an object. It's a concept that deserves a name of its own. This is not cheating. 

## Argument lists 

Sometimes we want to pass a variable number of arguments into a function. Mperhaps something like formatting a string. If you treat the arguments identically, they can likely be treated as one list. 

## Verbs and keywords 

Choosing good names for a function can go a long way toward explaining its intent, and the intention of its arguments and their order.  

With a monad, the function and argument should form a very nice verb/noun pair. `write(name)` is evocative. Whatever `name` is, is being `written`. 

## Have no side effects 

Side effects are lies. Your function should promise to do one thing. If it does something hidden, it has lied. Consider this function. It uses an algorithm to match a `userName` to a `password`. It returns `true` if they match and `false` if anything goes wrong. But it has a side effect: 

```
function userValidator() {
    var cryptographer;

    function checkPassword(userName, password) {
        user = UserGateway.findByName(userName);
        if (user != null) {
            codedPhrase = user.getPhraseEncodedByPassword();
            phrase = cryptographer.decrypt(codedPhrase, password);
            if (phrase == "Valid Password) {
                Session.initialize();
                return true;
            }
        }
        return false
    }
}
```

The side effect is calling `Session.initialize()`. The `checkPassword` function says it will check the password. But it *also* initializes the session. This side effect creates a **temporal coupling**. `checkPassword` can only be called when it is safe to initialize the session. if it is called out of order, session data may be lost.  

Temporal couplings are confusing, esepcailly when hidden as a side effect. If you must have a temporal copuling, make it clear by naming the function something like `checkPasswordAnd InitializeSession`.  Of course, this would violate "do one thing". 

## Command Query Separation 

Functions should either *do something* or *answer something*, but not both. Doing both leads to confusion. 

## Extract Try/Catch blocks 

`Try/Catch` blocks are ugly in their own right. They mess up the structure of the code and mix error processing with normal processing. It is better to extract the bodies of the `try` and `catch` blocks into their own functions: 

```
function delete(page) {
    try {
        deletePageAndAllReferences(page);
    } catch (e) {
        console.log(e);
    }
}

function deletePageAndAllReferences(page) {
    deletePage(page);
    registry.deleteReference(page.name);
    configKeys.deleteKey(page.name.makeKey());
}
```

The `delete()` function here is all about error processing. It is easy to understand and then ignore. The `deletePageAndAllReferneces` function is about the processes of fully deleting a page. Error handling can be ignored. This provides separation that makes the code easier to understand and modify. 

## Don't repeat yourself 

Duplication is a problem because it bloats code and requires modification in multiple areas. It is also an opportunity for N errors of omission. 

Duplication may be the root of all evil in software. Many principles and practices have been created for the purpose of controlling or eliminating it. Innovations in software are often an attempt to eliminate duplication from source code. 

## So how do you do all this? 

Writing software is like any other kind of writing. You get your thoughts down first, then massage it until it reads well. The first draft may be clumsy and isorganized, so you wordsmith it and restructure and refine until it reads well. 

## Conclusion 

Every system is built from domain-specific language designed by programmers to describe that system. Functiosn are the verbs of that language. Classes are the nouns. 

The art of programming is and has always been the art of language design. 

Master programmers think of systems as stories to be told rather than programs to be written. They use facilities of their programming language to construct a richer and more expressive language that can be used to tell that story.  
