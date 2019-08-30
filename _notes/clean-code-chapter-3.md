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


