/**
* Adds some helper methods to Node when working on the server.
* @module nodejs-node
*/
YUI.add('nodejs-node', function(Y) {
    
    Y.Node.prototype.focus = function() {};
    Y.Node.prototype.blur = function() {};

    /**
    * Clones a node from one document to another document. Useful when working with a remote document.
    * @method importNode
    * @param {Node} node The node to insert into this document.
    * @param {Boolean} deep Create a deep copy
    */
    Y.Node.prototype.importNode = function(node, deep) {
        node = node.cloneNode(deep);
        var newDoc = Y.config.doc, n = node._node;
        
        n._ownerDocument = newDoc;
        n._attributes._ownerDocument = newDoc
        n._ownerElement = null;

        return node;
    };
}, 'NODE', { requires: ['node'] });
