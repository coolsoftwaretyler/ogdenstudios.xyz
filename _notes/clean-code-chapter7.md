---
layout: post
title: Clean Code Chapter 7
---

# Error Handling

Many code bases are completely dominated by error handling. It is nearly impossible to see what the code does because of all the scattered error handling. 

Error handling is important, but if it obscures logic, it's wrong. 

## Use Exceptions rather than return codes 

Many older languages didn't have exceptions built in, so people manually set up return codes people could check. 

Consider: 

```
var DeviceController = function() {
    deviceHandle = getHandle('DEV1');

    if (handle != deviceHandle.INVALID) {
        retrieveDeviceRecord(handle);
    }

    if (record.getStatus() != DEVICE_SUSPENDED) {
        pauseDevice(handle);
        clearDeviceWorkQueue(handle0:
        closeDevice(handle);
    } else {
        logger.log("Device suspended. Unable to shut down");
    }

    else {
        logger.log("Invalid handle for: " + Dev1.toString());
    }
}
```

The prolbem with this approach is that it clutters the caller. The caller must chekck for errors immediately after th call. Unfortunately, it's easy to forget. 

For this reason it's better to throw an exception when you encounter an error. The calling code is lcleaner. The logic is not obscured by error handling. 

Check this approach: 

```
var DeviceController = function() {
    function sendShutDown() {
        try {
            tryToShutDown();
        } catch (e) {
            console.error(e);
        }
    }

    function tryToShutDown() {
        handle = getHandle(DEV1);
        record = retriveDeviceRecord(handle);

        pauseDevice(handle);
        clearDeviceWorkQueue(handle);
        closeDevice(handle);
    }
}
```

Notice how much cleaner it is. This isn't just aesthetics. It's better because two concerns whtat wer tangled, the algorithm for device shutdown and error handling, are now separate. You can look at each of those concerns and understand them independently. 

## Write your try-catch-finally statement first

Exceptions *define a scope* within a program. When you execute code in the `try` portion of a `try-catch-finally` statment, you are stating the exeuction can abort at any point and reusme at the `catch`. 

`try` blocks are like transactions. The `catch` has to leave your program in a consistent state, no matter what happens in `try`. It's good practice to strat with the try/catch when you're writing code that could throw exceptions. It helps define waht the user of that code should expect, no matter what goes wrong. 

Try to write tests that force exc eptions, and then add behaviro to your handler to satisfy your tests. This will cause you to build the transaction scope of the `try` block first and help you maintain the transaction nature of that scope. 

## Provide context with exceptions 

Each exception you throw should provide enough context to determine the source and lcoation of an error. A stack trace can't tell you the intent of th eoperation that failed. 

## Define exception classes in terms of a caller's needs 

We can classify errors by source (did they come from one component or another), or their type (are they device faiulres, network fails, or programming errors). 

However, when we define exception classes in an application, the most important concern is *how they are caught*. 

Consider wrapping errors and exceptions in helper classes. It allows you to reduce duplication and change how you define exceptions in the future. 

## Define the normal flow 

If you follow this advice, you'll end up with a good amount of separateion betwee business logic and error handling. The bulk of the code will start to look like a clean unadorned algorithm. 

Howver, doing this pushes error detection to the edges of your program. You wrap external apiS SO YOU CAN THROW YOUR OWN EXCEPTIONS. YOU DEFINE A HANDLER ABOVE YOUR CODE SO YOU CAN DEAL WITH ANY ABORTED COMPUTATION. 

USUALLY THIS IS A GREAT APPROACH, BUT THERE ARE SOME TIMES WHERE YOU MAY NOT WANT TO ABORT. 

AN EXAMPLE. HERE'S SOME AWKWARD CODE THAT SUMS EXPENSES IN A BILLING APPLICATION: 

```
try {
    expenses = expenseReportDAO.getMeals(employee.getID());
    m_total += expenses.getTotal();
} catch(e) {
    m_total += getMealPerDiem();
}
```

If meals are epxensed, they become a part of the total. if they aren't, the employee gets a meal per diem amount for that day. The exception clutters the logic. Wouldn't it be better if we didn't have to deal with the specail case? if we didn't, our code would look simpler. It would look like this: 

```
expenses = expenseReportDAO.getMeals(employee.getID());
m_total += expenses.getTotal();
```

Can we make it that simple? Turns out we can. We can change the `ExpensReportDAO` so that it always returns a `MealExpense` object. If there are no meal expenses, it returns a `MealExpense` object that returns the per diem as its total. 

This is called the **special case pattern**. You create a class or configuration object so it handles a special case for you. When you do, you don't have to have your client code deal with exceptional behavior. That behavior is encapsulated in the special case object. 

## Don't return null 

Discussing error handling should mention things that invite error. The first on the list is returning `null`. 

There are so many bad code bases out there that are always checking for null. Like this: 

```
function registerItem(item) {
    if (item !== null) {
        registry = persistentStore.getItemRegister();
        if (registry != null) {
            exisitng = registry.getItem(item.getID());
            if (existing.getBillingPeriod().hasRetailOwner()) {
                existing.registe(item)
            }
        } 
    }
}
```

If you work in a code base like this, it may not look all that bad. But it is bad! When we return `null`, we are creating work for ourselvs and foisting problems upon our callers. All it takes is one missing `null` check to send an application out of control. 

If you are tempted to return `null` from a method, consider throwing an exception or returning a **special case** object instead. 

If you are calling a `null` returning method from a third-party PI, consider wrapping it in a method that throws an exception or returns a special case object. 

Fortunately, this can be an easy fix. Consier you have this: 

```
function getEmployers() {
    if (employees != null) {
        for (e in employees) {
            totalPay += e.gePay();
        }
    }
}
```

But if you can define the method that returns employees to send an empty array like this: 

```
function getEmployees() {
    if (there are no employees) {
        return [];
    }
}
```

You can write: 

```
function getPay() {
    for (e in employees) {
        totalPay += e.getPay();
    }
}
```

## Don't pass null

Returning `null` from methods is bad, but passing `null` into methods is worse. Unless you're working with an API that requires it, you should avoid this wherever possible. 

In most programming languages, there is no good way to deal with a `null` that is passed by a caller accidentally. The rational approach is to forbid passing `null` by default. When you do, you can code with the knowledge that a `null` in an argument lsit is an indication of a problem, and end up with fewer mistakes. 

## Concluion 

Clean code is readable, but it must also be robust. These are not conflicting goals. W ecan write robust clean code if we see error handling as a separate concern,something that is viewable independently of our main logic. To the degree that we are albe to do that, we can reason about it independently, and we can make great strides in the maintainability of our code. 