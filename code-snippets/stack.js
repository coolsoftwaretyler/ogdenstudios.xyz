let Stack = function() {
    let S = [];
    let top = 0;

    function stackEmpty() {
        return (top === 0);
    }

    function push(element) {
        top = top + 1;
        S[top - 1] = element;
    }

    function pop() {
        if (stackEmpty()) {
            throw "Stack underflow"
        } else {
            top = top -1;
            return S[top];
        }
    }

    return {
        stackEmpty: stackEmpty,
        push: push,
        pop: pop,
        stack: S
    }
}

function demo() {
    let s = new Stack();
    console.log(s.stackEmpty());
    s.push('Something');
    console.log(s.stack);
    console.log(s.pop());
}

module.exports = Stack;