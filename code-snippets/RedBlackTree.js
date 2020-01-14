class Node {
    constructor(key) {
        this.color = null;
        this.key = key;
        this.left = null;
        this.right = null;
        this.p = null;
    }
}

class RedBlackTree {
    constructor() {
        this.root = null;
    }

    leftRotate(node) {
        let y = node.right;
        node.right = y.left;
        if (y.left !== null) {
            y.left.p = node;
        }
        if (node.p === null) {
            this.root = y;
        } else if (node === node.p.left) {
            node.p.left = y;
        } else {
            node.p.right = y;
            y.left = node;
            node.p = y;
        }
    }

    rightRotate(node) {
        let y = node.left;
        node.left = y.right;
        if (y.right !== null) {
            y.right.p = node;
        }
        if (node.p === null) {
            this.root = y;
        } else if (node === node.p.right) {
            node.p.right = y;
        } else {
            node.p.left = y;
            y.right = node;
            node.p = y;
        }
    }

    insert(node) {
        let y = null;
        let x = this.root;
        while (x !== null) {
            y = x;
            if (node.key < x.key) {
                x = x.left;
            } else {
                x = x.right;
            }
        }
        node.p = y;
        if (y === null) {
            this.root = node;
        } else if (node.key < y.key) {
            y.left = node;
        } else {
            y.right = node;
        }
        node.left = null;
        node.right = null;
        node.color = "RED";
        if (node.p !== null) {
            this.insertFixup(node);
        }
    }

    insertFixup(node) {
        while (node.p.color === "RED") {
            if (node.p === node.p.p.left) {
                let y = node.p.p.right;
                if (y.color === "RED") {
                    node.p.color = "BLACK";
                    y.color = "BLACK";
                    node.p.p.color = "RED";
                    node = node.p.p;
                } else if (node === node.p.right) {
                    node = node.p;
                    this.leftRotate(node);
                }
                node.p.color = "BLACK";
                node.p.p.color = "RED";
                this.rightRotate(node.p.p);
            } else {
                let y = node.p.p.left;
                if (y.color === "RED") {
                    node.p.color = "BLACK";
                    y.color = "BLACK";
                    node.p.p.color = "RED";
                    node = node.p.p;
                } else if (node === node.p.left) {
                    node = node.p;
                    this.rightRotate(node);
                }
                node.p.color = "BLACK";
                node.p.p.color = "RED";
                this.leftRotate(node.p.p);
            }
        }
    }
}

let t = new RedBlackTree();
t.insert(new Node(0));
t.insert(new Node(1));
t.insert(new Node(-1));