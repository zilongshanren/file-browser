/*global Editor */

(function() {
    var fs = require('fs');

    Editor.registerPanel('file-browser.panel', {
        is: 'file-browser',
        _treeRoot: null,
        _filePath : '',

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
        'file-browser:add-item' : function() {
            this.$.tree.clear();
            this._refreshOpen();
        },
        _refreshOpen: function() {
            this.$.tree.clear();
            this._treeRoot = this.newEntry();
            // this._treeRoot.folded = false;

            this.$.tree.addItem(this.$.tree, this._treeRoot, {
                id: 'tree' + this._filePath,
                name: this._filePath
            });

            this._generateFileTreeView(this._filePath,
                                       this._treeRoot,
                                       function(error, files) {
                                           console.log(files);
                                       });
        },
        _openPath : function() {
            this._refreshOpen();
            //watch file change
            Editor.sendToCore('file-browser:watch-file-change', this._filePath);
        },

        ready: function() {
        },
        newEntry: function() {
            var ctor = Editor.elements['tree-item'];
            return new ctor();
        }
    });
})();
