(function() {
    var fs = require('fs');

    Editor.registerPanel('file-browser.panel', {
        is: 'file-browser',
        listeners: {
            'item-select': '_onItemSelect'
        },
        _onItemSelect: function(event) {
            console.log("select item");
        },
        'selection:selected': function(type, ids) {
            console.log("selection:selected");
        },

        ready: function() {
            //read a direcotry recursively
            var walk = function(dir, done) {
                var results = [];
                fs.readdir(dir, function(err, list) {
                    if (err) return done(err);
                    var i = 0;
                    (function next() {
                        var file = list[i++];
                        if (!file) return done(null, results);
                        file = dir + '/' + file;
                        fs.stat(file, function(err, stat) {
                            if (stat && stat.isDirectory()) {
                                walk(file, function(err, res) {
                                    results = results.concat(res);
                                    next();
                                });
                            } else {
                                results.push(file);
                                next();
                            }
                        });
                    })();
                });
            };

            var root = this.newEntry();
            root.folded = false;

            var firstChild = this.newEntry();
            this.$.tree.addItem(root, firstChild, {
                id: 'first',
                name: 'first child'
            });

            var firstChildSibling = this.newEntry();
            this.$.tree.addItem(root, firstChildSibling, {
                id: 'second',
                name: 'second child'
            });

            var firstGrandChild = this.newEntry();
            this.$.tree.addItem(firstChild, firstGrandChild, {
                id: 'grand child',
                name: 'grand child node'
            });

            this.$.tree.addItem(this.$.tree, root, {
                id: 'tree',
                name: 'test name'
            });
            this.$.loader.clear();
            // walk("/Users/guanghui/cocos2d-x/cocos/ui", function(error, files) {
            //     console.log(files);
            // });
        },
        build: function(data) {
            console.time('tree');

            data.forEach(function(entry) {
                var newEL = this.newEntryRecursively(entry);
                this.$.tree.addItem(this.$.tree, newEL, {
                    id: entry.path,
                    name: entry.name
                });

                newEL.folded = false;
            }.bind(this));

            this.$.loader.clear();
            console.timeEnd('tree');
        },

        newEntryRecursively: function(entry) {
            var el = this.newEntry();

            return el;
        },

        newEntry: function() {
            var ctor = Editor.widgets['tree-item'];
            return new ctor();
        },
    });
})();
