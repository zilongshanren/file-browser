/*global Editor */

var chokidar = require('chokidar');

module.exports = {
    load: function() {
        this._watcher = null;
    },

    unload: function() {
        this._cleanUpWatcher();
    },
    _cleanUpWatcher: function() {
        if (this._watcher) {
            this._watcher.close();
            this._watcher = null;
        }
    },
    'file-browser:watch-file-change': function(filePath) {
        this._cleanUpWatcher();

        this._watcher = chokidar.watch(filePath, {
            persistent: true,
            followSymlinks: true,
            ignored: '.*'
        });

        var log = console.log.bind(console);

        this._watcher
            .on('add', function(path) {
                Editor.sendToPanel('file-browser.panel', 'file-browser:add-item', path );
            })
            .on('change', function(path) {
                log('File', path, 'has been changed');
            })
            .on('unlink', function(path) {
                log('File', path, 'has been removed');
            })
            .on('addDir', function(path) {
                Editor.sendToPanel('file-browser.panel', 'file-browser:add-item', path );
            })
            .on('unlinkDir', function(path) {
                log('Directory', path, 'has been removed');
            });


    },

    'file-browser:open': function() {
        Editor.Panel.open('file-browser.panel');
    }
};
