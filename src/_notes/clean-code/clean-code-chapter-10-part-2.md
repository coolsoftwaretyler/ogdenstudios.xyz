---
layout: post
title: Clean Code Chapter 10 Part 2
---

So breaking a large function into many smaller functions gives us the opportunity to split several smaller classes out as all. It can give our program a much better organization and more transparent strcture. 

Let's look at this example. It's a great starting place for breaking up a big funciton into many smaller functions and classes. 

```
var PrintPrimes = function() {
    function main() {
        const M = 1000;
        const RR = 50;
        const CC = 4;
        const WW = 10;
        const ORDMAX = 30;
        var P = [].fill(null, M+1)
        var pagenumber
        var pageoffset
        var rowoffset
        var c;
        var j;
        var k;
        var jprime;
        var ord;
        var square;
        var n;
        var mult = [].fill(null, ORDMAX+1);

        j =1;
        k = 1; 
        p[1] = 2;
        ORD =2;
        SQAURE = 9;

        while (K < M) {
            do {
                j = j + 2;
                if (j == square) {
                    ord = ord +1;
                    square = p[ord] * p[ord]
                    mult[ord -1] = j;
                }
            }
            N = 2;
            jprime = true;
            while (N < ord && jprime) {
                while (mult[n] < J) {
                    mult[n] = mult[n] + p[n] + p[n];
                    if (mult[n] == j) {
                        jprime = false;
                    }
                }
                n = n +1;
            }
        } while (!Jprime); 
        k= k+1;
        p[k] = j;
    }
    PAGENUMBEER = 1;
    PAGEOFFSET = 1;
    while (PAGEOFFSET <= M) {
        console.log("The First " + M + " Prime numbers --- pge " PAGENUMBER);

for (ROWOFFSET = PAGEOFFSET; ROWOFFSET < PAGEOFFSET + RR; ROWOFFSET++)
    FOR (c = 0; c < cc; c++) {

    }>)
    })
}
```

This proram, written as a singel function, is a mess. It has a deeply indented structure, a plethora of odd variables, and a tightly coupled strcture. At the very least, the one big function should be split up into a few smaller functions. 

Here's the result of splitting the code into smaller classes and fucntions and choosing meaningful names. 

```
var PrimePrinte = function() {
    function main() {
        const NUMBER_OF_PRIMES = 1000;
        primes = PrimeGenerator.generate(NUMBER_OF_PRIMES)

        const ROWS_PER_PAGE = 50;
        const COLUMNS_PER_PAGE = 4;
        tablePrinter = new RowColumnPagePrinter(ROWS_PER_PAGE, COLUMNS_PER_PAGE, "the First " + NUMBER_OF_PRIMES + " Prime numbers");
        tablePrinter.print(primes);
    }

    var RowColumnPagePrinter = function() {
        var rowsPerPage;
        var columnsPerPage;
        var numbersPerPage;
        var pageHeader;
        var printStream;

        return function(rowsPerPage, columnsPerPage, pageHEeader) {
            this.rowsperPage = rowsPerPage;
            this.columnsPerPage = columnsPerPage;
            this.pageHeader = pageHeader;
            numbersPerPage= rowsPerPage * columnsPerPage
        }

        function print(data) {
            var pageNumber= 1;
            for (firstIndexOnPage =0; firstIndexOnPage < data.length; firstIndexOnPage += numbersPerPage) {
                var lastIndexOnPage = Math.min(firstINdexOnPage + numbersPerPage 1, data.length -1)
                printPageHeader(pageHEader, pageNumber);
                printPage(firstIndexOnPage, lastIndexOnPage, data);
                console.log("\f");
                pageNumber++;
            }
        }

        function printPage(firstIndexOnPage, lastINdexOnPage, data) {
            firstIndexOfLasRowOnPage = firstIndexOnPage + rowsperPage -1;
            for (firstIndexInrow = firstIndexOnPage; firstIndexInrow <= firstIndexOfLastWowOnPage; firstIndexInRow__) {
                printRow(firstIndexInRow, lastIndexOnPage, data);
                console.log("");
            }>)
        }

        function printRow(firstINdexInRow, lastIndexOnPage, data) {
            for (column = 0; column<columnsPerPage; column++) {
                index = firstIndexINrwo + column * rowsPerPage;
                if (index <= lastIndexOnPage) {
                    console.log("%10d", data[index]);
                }>)
            }
        }

        function printPageHEader(pageHeader, pageNumber) {
            console.log(PageHeader + " --- Page " + pageNumber);
            console.log("");
        }

        function SetOutput(printStream) {
            this.printStream = printStream;
        }
    }

    var PrimeGenerator = function() {
        var primes = [];
        function generate(n) {
            primes = new [].
            multiplesOfPrimeFactors = new [];
            set2AsFirstPrime();
            checKOddNumbersForSubsequentPrimes();
            return primes
        }
        function set2AsFirstPrime() {
            primes[0] = 2;
            multiplesOfprimeFactors.add(2);
        }

        function checkoddNumbersForSubsequentPrimes() {
            primeIndex = 1;
            for (candidate = 3; primeIndex <primes.length; candidate += 2) {
                if (isPrime(candidate)) {
                    primes[primeINdex++] = candidate
                }
            }>)
        }

        function isPrime(candidate) {
            if (isLeastRelevantMultipleOfNextLargerPrimeFactor(candidate) {
                multiplesOfPrimeFactors.add(candidate);
                return false
            })\return isNotMultipleOfAnyPreviousPrimeFactor(candidate)
        }

        function isLeastRelevantMultipleOfNextLargerPrimeFactor(candidate) {
            nextLargerPrimeFactor= primes[multiplesOfPrimeFactors.size()]
            leasetRelevantMultple = nextLargerPrimeFactor & nextLargerPrimeFactor; 
            return candidate == leaseRelevantMultiple;
        }

        function isNotMultipleOfAnyPreviousPrimeFacotr(Candidate) {
            for (int n = 1; n< multillesOfPriemFactors.sie(); n++) {
                if (isMultipleOfNthPrimeFactor9candidate, n)) {
                    return false
                }
            }>)
        }

        function isMultipleOfNthPrimeFactor(candidate, n) 
        return candidte == smallestOddNthMultipleNotLessThanCandidate(candidate, n);

        function smallestOddNthMultipleNotLessThanCandidate(candidate, n) {
            multiple = multiplesOfPrimeFactors.get(n);
            while (multiple < candidate) {
                multiple += 2 * primes[n];
            }>)
            multiplesOfPrimeFacors.set(n, multil) {
                return multiple;
            }
        }
    }
}
```

The first thing you might notice is the program got onger. It went from over one page to nearly three. There are several reasons for this growth: 

1. The refactor program uses longer, more descriptive variable names
2. The refactored prgoram uses function and class declaration sas a way to add commentary to the code 
3. We used whtiespace and formatting tecniques to keep the program readable 

Notice, it's been split into three responsibilityies: 

The main programis contained in the `PrimePrinter` class. Its responsibility is to handle the execution environemnt. IT will change if the method of incovation changes. This class would be changed if it was run from different envioronments. 

The `RowColumnPagePrinter` knows how to format a list of numbers into page with a certain number of rows and columns. If the formatting of the output needed changing, this is the class that would be effected. 

The `PrimeGenerator` can generate al ist of prime numbers. It is not meant to be instantiated as an object. It's just a useful scope in which its variables can be declared and kept hidden. This class will change if the alogirthm for computing prime numbers changes. 

THis wasn't a rewrite! We didn't start from scratch and write it again. You'll se they use the same algorithm and mechanics to get their work done. 

The change was made by writing a test suite that verified the *precise& behavior of the first program. Thena myriad of tiny little changes were made, one at a time. After each change the pgoram was executed to ensure the behaviro hadn't changed. One step after another, fthe first was cleadn up and transformed. 

## Organizing for change 

For ost systems, change is continual. Every change subjects us to the risk that the remainder of the systemno longer works as intended.  Is a clean system, we organize our classes to reduce the risk of change. 

Private method behavior that applies only to a small subset of a class can be a useful heuristic for spotting potential areas for improvement. However, the primar spur for taking action should be system change itself. If a class is logaclly complete, we odn't need to worry about separating the reponsibilities. If we find outselves modifying a class, we should consider fixing our design. 

We want to structure our systems so we muck with as little as possible when we update them with new or changed features. In an ideal system, we incorporate new features by extending the system, not by modifying the exiting code. 

## Isolating from change

Needs will change, so code will change. Aclient class depending on concrete details is at risk when details change. We can introduce interfaces and abstract classes to help isolate the impact of those details. 

Dependencie son concrete details create challenges fo rtesting the system. IF we're builind ga `Portfolio` class and it dependson an external `TokyoStockExchange` API to get the value, or test cases are impacted by the volatitliy of such a lookup. It's hard to write a test fi we get a different answer every fie minutes. 

Instead of designing `Porftolio` so it direclty depends on `tokyoStockExchange`, we create an interface, `StockExchange` that declares a method: 

```
function StockExchange() {
    return currentPRice();
}
```

We design `tokyostockexchange` to implement this interface >We make sure the constructor of `Porftolio` takes a `StockExchange` reference as an argument. 

Now we can test using a fixed StockExchange instead of the exact Tokyo exchange. We can test for concrete values. 

If a system is decoupled enough to be tested like this, it will be more flexible and promote more reuse. The lack of coupling means the elements of our system are better isolated frome ach other and from change. This isolation makes it easier to understand each element of the system.

By minimizing coupling in this way, our classes adhere to another class designp rinciple known as the Dependency Inversion Principle (DIP). In essence, the DIP says our classes should depend on abstractions, not on concrete details. 

Instead of being dependeing on th eimplementation details of the `TokyoStockExchange`, our `Portfolio` class is dependen on the `StockExchange` interface. The interface represents the abstract conept of asking for the current price of a symbol. This abstraction isolates the specific details of obtaining such a price, including from where that price is obtained. 