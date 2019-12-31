let Queue = function(size) {
    let Q = [];
    let tail = 1;
    let head = 1;

    function enqueue(element) {
        Q[tail] = element;
        if (Q.tail == size) {
            tail = 1;
        } else {
            tail = tail + 1;
        }
    }

    function dequeue() {
        x = Q[head];
        if (head == size) {
            head = 1;
        } else {
            head = head + 1;
        }
        return x;
    }

    return {
        enqueue: enqueue,
        dequeue: dequeue, 
        queue: Q
    }
}

function demo() {
    let q = new Queue(3);
    q.enqueue("First");
    q.enqueue("Second");
    console.log(q.queue);
    console.log(q.dequeue());
    console.log(q.dequeue());
}