/*global Editor */

(function() {
    var fs = require('fs');

    Editor.registerPanel('file-browser.panel', {
        is: 'file-browser',
        _treeRoot: null,

        _generateFileTreeView: function(dir, rootNode, done) {
            var results = [];
            fs.readdir(dir, function(err, list) {
                if (err) {
                    return done(err);
                }

                var i = 0;
                (function next() {
                    var file = list[i++];
                    if (!file) {
                        return done(null, results);
                    }

                    var fileFullPath = dir + '/' + file;
                    //add file to tree
                    var fileItem = this.newEntry();
                    this.$.tree.addItem(rootNode, fileItem, {
                        id: fileFullPath,
                        name: file
                    });

                    fs.stat(fileFullPath, function(err, stat) {
                        if (stat && stat.isDirectory()) {
                            this._generateFileTreeView(fileFullPath, fileItem, function(err, res) {
                                results = results.concat(res);
                                next.call(this);
                            }.bind(this));
                        } else {
                            results.push(file);
                            next.call(this);
                        }
                    }.bind(this));
                }.bind(this))();
            }.bind(this));
        },

        ready: function() {
            this._treeRoot = this.newEntry();
            this._treeRoot.folded = false;
            var filepath = '/Users/guanghui/cocos2d-x/cocos/ui';

            this.$.tree.addItem(this.$.tree, this._treeRoot, {
                id: 'tree',
                name: filepath
            });

            this._generateFileTreeView(filepath,
                this._treeRoot,
                function(error, files) {
                    console.log(files);
                });

            this.$.loader.clear();
        },
        newEntry: function() {
            var ctor = Editor.widgets['tree-item'];
            return new ctor();
        }
    });
})();
