YUI.add('parallel', function(Y) {

// supported options: 'context'
Y.Parallel = function(o) {
    this.config = o || {};
    this.results = [];
};

Y.Parallel.prototype = {
    total: 0,
    finished: 0,
    add: function (fn) {
        var self = this;
        self.total += 1;
        return function () {
            self.finished++;
            self.results.push(fn.apply(self.context || Y, arguments));
            self.test();
        }
    },
    test: function () {
        var self = this;
        if (self.finished >= self.total && self.callback) {
            self.callback.call(self.config.context || Y, self.results, self.data);
        }
    },
    done: function (callback, data) {
        this.callback = callback;
        this.data = data;
        this.test();
    }
};

}, '0.0.1', { requires: [ 'oop' ] });
