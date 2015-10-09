/*global Editor */

(function() {
    var fs = require('fs');

    Editor.registerPanel('file-browser.panel', {
        is: 'file-browser',
        _treeRoot: null,
        _filePath : '',

        _generateFileTreeView: function(dir, rootNode) {
            var files = fs.readdirSync(dir);
            files.forEach(function(file) {
                //add file to tree
                var fileFullPath = dir + '/' + file;
                var fileItem = this.newEntry();
                this.$.tree.addItem(rootNode, fileItem, {
                    id: fileFullPath,
                    name: file
                });
                if (fs.statSync(fileFullPath).isDirectory()) {
                    this._generateFileTreeView(fileFullPath, fileItem);
                }
            }.bind(this));
        },
        'file-browser:add-item' : function(path) {
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
