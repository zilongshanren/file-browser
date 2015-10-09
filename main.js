/*global Editor */

var chokidar = require('chokidar');

module.exports = {
    load: function() {
        this._fileWather = null;
    },

    unload: function() {
        this._cleanUpWatcher();
    },
    _cleanUpWatcher: function() {
        if (this._fileWather) {
            this._fileWather.close();
            this._fileWather = null;
        }
    },
    'file-browser:watch-file-change': function(filePath) {
        this._cleanUpWatcher();

        this._fileWather = chokidar.watch(filePath, {
            persistent: true,
            followSymlinks: true,
            ignored: '.*'
        });

        var log = console.log.bind(console);

        this._fileWather
            .on('add', function(path) {
                log('File', path, 'has been add');
                this._refreshFileBrowser(path);
            }.bind(this))
            .on('change', function(path) {
                log('File', path, 'has been changed');
                this._refreshFileBrowser(path);
            }.bind(this))
            .on('unlink', function(path) {
                log('File', path, 'has been removed');
                this._refreshFileBrowser(path);
            }.bind(this))
            .on('addDir', function(path) {
                log('Directory', path, 'has been added');
                this._refreshFileBrowser(path);
            }.bind(this))
            .on('unlinkDir', function(path) {
                log('Directory', path, 'has been removed');
                this._refreshFileBrowser(path);
            }.bind(this));
    },
    _refreshFileBrowser : function(path) {
        Editor.sendToPanel('file-browser.panel', 'file-browser:add-item', path );
    },

    'file-browser:open': function() {
        Editor.Panel.open('file-browser.panel');
    }
};
