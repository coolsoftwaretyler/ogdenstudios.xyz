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