/*global Editor */

(function() {
    var fs = require('fs');

    Editor.registerPanel('file-browser.panel', {
        is: 'file-browser',
        _treeRoot: null,
        _filePath: '',

        listeners : {
            'item-select': '_onItemSelect',
        },

        _onItemSelect: function ( event ) {
            event.stopPropagation();

            if ( event.detail.shift ) {
                Editor.Selection.confirm();
            } else if ( event.detail.toggle ) {
                Editor.Selection.confirm();
            } else {
                Editor.Selection.select( 'asset', event.target._userId, true );
            }
        },
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
                    fileItem.folded = false;
                }
            }.bind(this));
        },
        'file-browser:add-item': function(path) {
            this._refreshOpen();
        },
        _refreshOpen: function() {
            this.$.tree.clear();

            this._treeRoot = this.newEntry();
            this.$.tree.addItem(this.$.tree, this._treeRoot, {
                id: 'tree' + this._filePath,
                name: this._filePath
            });

            this._generateFileTreeView(this._filePath,
                this._treeRoot,
                function(error, files) {
                    console.log(files);
                });

            this.$.tree.selectItemById('tree' + this._filePath);
            this._treeRoot.folded = false;

        },
        'selection:selected': function ( type, ids ) {
            if ( type !== 'asset' )
            {
                return;
            }

            ids.forEach( function ( id ) {
                this.$.tree.selectItemById(id);
            }.bind(this));
        },
        onDeleteKeyPressed: function() {

        },
        _openPath: function() {
            this._refreshOpen();
            //watch file change
            Editor.sendToCore('file-browser:watch-file-change', this._filePath);
        },
        ready: function() {},
        newEntry: function() {
            var ctor = Editor.elements['tree-item'];
            return new ctor();
        }
    });
})();
