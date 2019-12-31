---
layout: post
title: Clean Code Chapter 9
---

# Unit tests 

Testing has come a long way in software development, but many programmers have missed some of the more subtle and important points of writing good tests. 

## The Three laws of TDD 

1. First law: You may not write production code until you have written a failing unit test 
2. Second law: you may not write more of a unit test than is sufficient to fail, and not compiling is failing. 
3. Third law: you may not write more production code than is sufficient to pass the currently failing test. 

These three laws lock you into a cycle that is perhaps thirty seconds long. The tests and the production code are written *together*. The tests are just a few seconds ahead of the production code. 

If we work this way, we will write dozens of teests every day. Those tests will cover virtually all of our production code. The bulk of those tests can present a daunting management problem. 

## Keeping tests clean 

Having dirty tests is equivalent to, if not worse than, having no tests. The tests must change as the produciton evolves. The dirtier the tests, the harder they  are to change. The more tangled the test code, the more likely you will spend time cramming new testinto the suite than it takes to write new produciton code. 

As you modify production code, old tests start to fail, and the mess makes it hard to get them to pass again. So the tests become viewed as an ever-increasing liability. 

**Test code is just as important as production code**. It is not a second-class citizen. It requires thought, design, and care. It must be kept as clean as production code.

If you don't keep your tests clean, you will lose them. And without them, you will lose the very thing that keeps your proudction code flexible. It is *unit tests* that keep code flexible, maintainable and resuable. If you have tests, you don't fear making changes to the code. 

Without tests, every change is a possible bug. 

With tests, you won't be afraid to make changes. The higher your test coverage, the less you fear. You can make changes with near impunity to code that has a less than stellar architecture. You can improve that architecture without fear. 

Tests enable the -ilities, because tests enable *change*. 

## Clean tests 

What makes a clean test? Three things: 

1. Readability
2. Readability
3. Readability. 

It is more importan in unit tests than it is in production code. You need clarity, simplicity, and density of expression. Consider the following code. IT could be imporoved. There is a terrible amount of dupilcate code in the repeated calls to `addPage` and `asserSubtString`. More importantly, it is loaded with details that interfere with the expressiveness of the test. 

```
function testGetPageHierarchAsXml() {
    crawler.addPage(root, PathParser.parse("PageOne"));
    crawler.addPage(root, PathParser.parse("PageOne.ChildeOne"));
    crawler.addPage(root, PathParser.parse("PageTwo"));

    request.setResource("root");
    request.addInput("type", "pages"0;
    responder = new SerializedPageResponder();
    response = responder.makeResponse(new FitNessContext(root), request);
    xml = response.getContent(); 

    assertEquals("text/xml", resposne.getContentType());
    assertSubString("<name>PageOne</name>", xml);
    assertSubString("<name>PageTwo</name>", xml);
    assertSubString("<name>ChildeOne</name>", xml);
}

function testGetPageHierarchyAsXmlDoesntContainSymbolicLinks() {
    pageOne = crawler.addPage(root, PathParser.parse("PageONe"));
    crawler.addPage(root, PathParser.parse("PageOne.ChildeONe"));
    crawler.addPage(Root, PathParser.parse("PageTwo"));

    data = pageOne.getData();
    properties = data.getProperties();
    symLinkes = properties.set(SymbolicPage.PROPERTY_NAME);
    symLinks.set("SymPage", "PageTwo");
    pageOne.commit(data);

    request.setResource("root"0;
    request.addInput("type", "pages");
    responder = new SerializedPageResponder()
    response = responder.makeResponse(new FitNesseContext(root), request); 
    xml = response.getContent();

    assertEquals("text/xml", resposne.getContentType());
    assertSubString("<name>PageOne</name>", xml);
    assertSubString("<name>PageTwo</name>", xml);
    assertSubString("<name>ChildeOne</name>", xml);
    assertNotSubString("Sympage", xml);
}

function testGetDataAsHtml() {
    crawler.addPage(root, PathParser.parse("TestPageOne"), "test page");
    request.setResource("TestPageONe");
    request.addInput("type", "data");

    responder = new SerializedPageResonder();
    response = responder.MakeResponse(new FitNessContext(root), request); 
    xml = response.getCurrent;

    asserEquals("text/xml", response.getContentType());
    asseSubString("test page", xml);
    asserSubString("<text", xml>))
}
```

Consider the 1`pathParser` calls. They transform strings into `PagesPath` intances used by the crawlers. This is irrelevant to the test and only obfuscates the intent. 

The etails surrounding the creation of the `responder` and the gathering and casting of the `response` are alos noise. 

In the end, this code was not designed to be read. The reader is inundated with a swarm of details tha tmust be understood before the tests make any sesnse. 

Consider these improved tests: 

```
function testGetPageHierarchyAsXml() {
    makePage("PageOne", "PageOne.ChildOne", "PageTwo");

    submitRequest("root", "type:pages");

    asserResponseIsXML();
    asserResponseContains("PageOne", "PageTwo", "ChildeONe");
}

function testSymbolicLinksArenotInXmlPageHierarch() {
    page = makePage("PageOne");
    makePages(PageOne.ChildOne", "PageTwo"0;
    
    addLinkTo(Page, "PageTwo", "Sympage");
    submitRequest("root", "type: pages");
    
    asserTesponseIsXML();
        asserResponseContains("PageOne", "PageTwo", "ChildeONe");
    asserResposneDoesNotConatin("Sympage");
}

function testGetDataAsXml() {
    makePageWithContent("TestPageONe", "test page"); 

    submitRequest("TestPageOne", "type:data");

    asserResponseIsXML(0;
    asserResponse("test page"), "Text"0;)
}
```

The `build-operate-check` pattern is made obvious by the structure of these tests. Each test is clearly isplit into three parts: 

1. Build up the data 
2. Operate the data
3. Check the operation yielded expected results. 

The annoying detail has been eliminated. The tests get to the point and use only the data types and fucntions they truly need. Anyone who reads them should be able to work out waht they do quickly, without being misled or overwhlemed by details. 

### Domain-specific testing language 

The tests in the second one demonstrate the technique of buildin ga domain-specific language for tests. Rather than using the APIs that programmers use to manipulate the system, we build up a set of function and utilities that make use of those apis that make the ttests more convenient to write and easier to read. 

These functiosn and utilities become a specialized API used by the tests. They are a testing language that programmers use to help write tests and help those who must read the tests. 

This testing API is not designed up front. it evolves from the continued refactoring of test code that has gotten too tainted by obfuscating details. 

### A double standard

The code in the testing API *does* have a different set of standards. It should be simple, succinct, and expressive. But it doesn't need to be as efficient as production code. It runs in a different environment. 

## One assert per test 

This rule may sometimes seem draconina, but the advantage can be seen in this code snippet: 

```
function testGetPageHierarchyAsXml() {
    givenPages("PageOne", "PageOne.ChildOne", "PageTwo");

    whenRequestIsIssued("root", "type:pages");

    thenResponseShouldBeXML();
}

function testGetPageHierarchYasRightTags() {
    givenPages("PageONe", "pageOne.ChildOne", "PageTwo");

    whenRequestIsIssued("root", "type:pages");

    thenResponseSHouldContain(
        ". . ."
    )
}

```

It results in a lot of duplicate code. But it's easy to read. 

The single assert rule is a good guideline. But it's not a hard and fast rule. Just that in general, the number of asserts in a test ought to be minimized. 

## Single Concept per Test

Perhaps a better rule is we want to test a single concept in each function. We don't want long test functiosn that test one misc. thing after another. This is an example of such a tst. It thould be split into three independent tests because it tests three independnet things. Merging them into the same function forces the reader to figure out why each section is there and what's beign tested. 

```
function testAddMonths() {
    d1 = SerialDate.createInstance(31, 5, 2004);

    d2 = SerialDate.addMonths(1, d1);
    asserEquals(30, d2.getDayOfMonth());
    asserEquals(6, d2.getMonth());
    assertEquals(2004, d2.getYYY());

    d3 = SerialDate.addMonths(2, d1);
    asserEqauls(31, d3.getdayofMonth)0;
    asserEquals(7, d3.getMonth());
    asserEquals(2004, d3.getYYY());

    d4 = serialDate.addMonths(1, SerialDate.addMonths(1, d1));
    asserEQuals(30, d4.getdayOfmonth()0;
    asserEquals(7, d4.getMonth());
    asserEquals(2004, d4.getYYY());)
}
```

The three function ought to be like this: 

1. Given the last day of a month with 31 days (like May): 
    * When you add one motnh, such that the last day of tha tmonth is the 30th, then the date should be on the 30th, not the 31st
    * When you add two months to that date, such that the final month has 31 days, then the date should be the 31st. 

2. Given the last day of th emonh with 30 days i it like june
    * When you add on emonth such that the last day of that monht has 31 days, then the date should be the 30th, not the 31st. 

State like this, there is a general rule hiding amongst the misc. tests. Incrementing the month can yield not date greater than the last day of the month. 

The test for Feb. 28th is missing, which would be useful. 

It's not the multipel asserts that causes the problem. It's the fact that there is more than one concept being tested. The best rules is you should minimize the number oa sserts per concept and test one concpet per functio. 

## F.I.R.S.T.

Clean test follow five other rules thatr form the above: 

1. Fast: test should run quickly. When tests run slow, you won't run them. If you don't run them, you won't use them. Your code will rot. 
2. Independent: tests should not depend on each other. WHen tests depend on each other, they cause a cascade of failures and are hard to diagnose
3. Repeatable: they should run in any environemtn. If not, you'll always have an excuse for why the fail. 
4. Self-validating: the test should have a boolean output. They either pass or fail. You shouldn't read through a log file to tell if they past. 
5. Timely: you need to write them in a timely fashion. Unit tests should be written *just before* produciton code that maeks them past. If you write them after prod code, the production code will be hard to test. You may not test some. 

