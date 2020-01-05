class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(node) {
        y = null;
        x = this.root;
        while (x !== null) {
            y = x;
            if (node.data < x.data) {
                x = x.left;
            } else {
                x = x.right;
            }
        }
    }

    inorder(node) {
        if (node !== null) {
            console.log(node.data);
            inorder(node.left);
            inorder(node.right);
        }
    }

    search(node, data) {
        if (node === null || data === node.data) {
            return node;
        }
        if (data < node.data) {
            return this.search(node.left, data)
        } else {
            return this.search(node.right, data)
        }
    }

    minimum(node) {
        if (node.left !== null) {
            this.minimum(node.left);
        } else {
            return node;
        }
    }

    maximum(node) {
        if (node.right !== null) {
            this.maximum(node.right);
        } else {
            return node;
        }
    }
}
class Node {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.p = null;
    }
}

class Tree {
    constructor(root) {
        this.root = root;
    }
    inorderTreeWalk() {
        this.walk(this.root);
    }
    walk(node) {
        if (node !== null) {
            this.walk(node.left);
            console.log(node.key);
            this.walk(node.right);
        }
    }
    treeSearch(node, k) {
        if (node === null || k === node.key) {
            return node;
        } else if (k < node.key) {
            return this.treeSearch(node.left, k);
        } else {
            return this.treeSearch(node.right, k);
        }
    }
    iterativeTreeSearch(node, k) {
        while (node !== null && k !== node.key) {
            if (k < node.key) {
                node = node.left;
            } else {
                node = node.right;
            }
        }
        return node;
    }
    treeMinimum(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }
    treeMaximum(node) {
        while (node.right !== null) {
            node = node.right;
        }
        return node;
    }
    treeSuccessor(node) {
        if (node.right !== null) {
            return this.treeMinimum(node.right);
        }
        y = node.p;
        while (y !== null && node === y.right) {
            node = y;
            y = y.p;
        }
        return y;
    }
    treePredecessor(node) {
        if (node.left !== null) {
            return this.treeMaximum(node.left);
        }
        y = node.p;
        while (y !== null && node === y.left) {
            node = y;
            y = y.p;
        }
        return y;
    }
    insert(node) {
        let y;
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
    }
    delete(node) {
        if (node.left === null) {
            this.transplant(node, node.right);
        } else if (node.right === null) {
            this.transplant(node, node.left);
        } else {
            let y = this.treeMinimum(node.right)
            if (y.p !== node) {
                this.transplant(y, y.right);
                y.right = node.right;
                y.right.p = y;
            }
            this.transplant(node, y);
            y.left = node.left;
            y.left.p = y;
        }
    }
    transplant(u, v) {
        if (u.p === null) {
            this.root = v;
        } else if (u == u.p.left) {
            u.p.left = v;
        } else {
            u.p.right = v;
        }
        if (v !== null) {
            v.p = u.p;
        }
    }
}

let n = new Node(0);
let t = new Tree(n);
t.insert(new Node(1));
t.insert(new Node(2));
t.insert(new Node(-1));
t.insert(new Node(-10));
t.delete(t.root);
t.inorderTreeWalk();
