/*global Editor */

(function() {
    // var fs = require('fs');

    Editor.registerPanel('file-browser.panel', {
        is: 'file-browser',
        _treeRoot: null,
        _filePath: '',
        _currentSelection: null,
        'file-browser:delete-item': function(path){
            var item = document.getElementById(path);
            item.parentNode.removeChild(item);
        },
        'file-browser:add-item': function(path, type) {
            var filename = path.slice(this._filePath.length);
            var treeRoot = this.$.tree;
            var child = document.createElement('p');
            child.innerText = path;
            child.id = path;
            child.addEventListener('click', function() {
                // TODO:
                child.style.background = '#333333';
                this._currentSelection = path;
                this.$.status.innerText = filename + ' is selected';
            }.bind(this), false);
            treeRoot.appendChild(child);

            if (type === 'file') {
                this.$.status.innerText = 'file is added.';
            } else if (type === 'dir') {
                this.$.status.innerText = 'directory is added.';
            }
        },
        onDeleteKeyPressed: function() {
            Editor.sendToCore('file-browser:delete', this._currentSelection);
        },
        selectPrev : function() {
            this.$.status.innerText = 'select prev';
        },
        selectNext: function() {
            this.$.status.innerText = 'select next';
        },
        _openPath: function() {
            //watch file change
            Editor.sendToCore('file-browser:watch-file-change', this._filePath);
        },
        ready: function() {
            this.$.status.style.background = 'Green';
        }
    });
})();
