/*global Editor */

(function() {
    // var fs = require('fs');

    Editor.registerPanel('file-browser.panel', {
        is: 'file-browser',
        _treeRoot: null,
        _filePath: '',
        _currentSelection: null,
        'file-browser:delete-item': function(path) {
            var item = document.getElementById(path);
            item.parentNode.removeChild(item);
            this.$.status.innerText = path + ' is deleted.';
        },
        'file-browser:add-item': function(path) {
            var filename = path.slice(this._filePath.length);
            var numberOfSlash = (filename.match(/\//g) || []).length;

            var lastFileComponent = path.split('/').pop();
            var child = document.createElement('div');
            child.innerText = lastFileComponent;
            child.style.paddingLeft = numberOfSlash * 20 + 'px';
            child.id = path;
            child.addEventListener('click', function(e) {
                e.preventDefault();
                child.style.background = '#333333';
                this._currentSelection = path;
                this.$.status.innerText = 'current selection is ' + path;
            }.bind(this), false);

            //find the parent id
            var lastSlash = path.lastIndexOf('/');
            var parentId = path.substring(0, lastSlash);
            var parent = document.getElementById(parentId);

            if(parent && parent !== this.$.tree){
                this.$.tree.insertBefore(child, parent.nextSibling);
            }else{
                this.$.tree.appendChild(child);
            }

        },
        onDeleteKeyPressed: function() {
            Editor.sendToCore('file-browser:delete', this._currentSelection);
        },
        selectPrev: function() {
            this.$.status.innerText = 'select prev';
        },
        selectNext: function() {
            this.$.status.innerText = 'select next';
        },
        _openPath: function() {
            //watch file change
            Editor.sendToCore('file-browser:watch-file-change', this._filePath);
            var treeRoot = this.$.tree;
            treeRoot.id = this._filePath;
            treeRoot.innerHTML = '';
        },
        ready: function() {
            this.$.status.style.background = 'Green';
        }
    });
})();
