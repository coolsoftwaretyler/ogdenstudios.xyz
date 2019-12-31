// 10.1.1
let Stack = require("./stack.js");
s = new Stack();
s.push(4);
s.push(1);
s.push(5);
s.pop();
s.push(8);
s.pop();
console.log(s.stack);

// 10.1.2
let DoubleStack = function (n) {
    S = [];
    top1 = 0;
    top2 = n;

    function stack1IsEmpty() {
        return (top1 === 0);
    }

    function stack2IsEmpty() {
        return (top2 === n);
    }

    function push1(element) {
        top1 = top1 + 1;
        S[top1 - 1] = element;
    }

    function push2(element) {
        top2 = top2 - 1;
        S[top2] = element;
    }

    function pop1() {
        if (stack1IsEmpty()) {
            throw "Stack is empty";
        } else {
            top1 = top1 - 1;
            return S[top1];
        }
    }

    function pop2() {
        if (stack2IsEmpty()) {
            throw "Stack is empty";
        } else {
            top2 = top2 + 1;
            return S[top2];
        }
    }

    return {
        stack1IsEmpty: stack1IsEmpty,
        stack2IsEmpty: stack2IsEmpty,
        push1: push1,
        push2: push2,
        pop1: pop1,
        pop2: pop2,
        stack: S
    }
}

let doubleStack = new DoubleStack(3);

console.log(doubleStack.stack1IsEmpty());
console.log(doubleStack.stack2IsEmpty());
doubleStack.push1("For the first stack");
doubleStack.push2("For the second stack");
console.log(doubleStack.pop1());
console.log(doubleStack.pop2());
console.log(doubleStack.stack);