## Delete 

1. If node has no children, we remove it by modifying its to replace the node with nil as its child
2. If node has just one child, we elevate that child to take its position by modifying the nodes' parent to replace the node with its child.
3. If the nod ehas two children, we find its successor y. It must be in the node's right subtree. We have y take the node's position in the tree. The rest of the node's original right tree becomes y's new subtree, and the node's left subtree becomes y's new left subtree. This third case is tricky because it matters whether y is the node's right child. 

Deleting a node from a binary search tree organizes its cases a bit differently than just those three options. We'll need four different cases: 

1. If the node has no left child, we replace the node by its right child. It's OK if that's `null`. If its right child is `null`, this case is the situation in which the node has no children. If the node's right child is not `null`, we're dealing with the situation in which the node only has a right child. 
2. If th enode has just one child, its left child, we replace the node with its left child. 
3. Otherwise, the nod ehas both a left and right child. We have to find the node's successor, `y`, which must live in the node's right subtree with no left child. We want to move `y` and replace the node with it. 
    - If `y` is the right child, then we replace the node with `y`, leaving `y`'s right child alone. 
    - Otherwise, `y` is still in the nodes' right subtree, but it's not the node's right child. Here, we repalce `y` by its own right child, and we replace the node by `y`. 

### Transplant 

To move subtrees around a binary search tree, we hav ea subroutine that replaces one subtree as a child of its parent with another subtree. 