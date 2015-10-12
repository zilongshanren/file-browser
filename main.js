/*global Editor */
var fs = require('fs');
var chokidar = require('chokidar');

rmDir = function(dirPath) {
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    fs.rmdirSync(dirPath);
};

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
    'file-browser:delete': function(filepath) {
        console.log('rm');
        rmDir(filepath);
    },
    'file-browser:watch-file-change': function(filePath) {
        this._cleanUpWatcher();

        this._fileWather = chokidar.watch(filePath, {
            persistent: true,
            followSymlinks: true,
            ignored: '.*'
        });


        this._fileWather
            .on('add', function(path) {
                Editor.sendToPanel('file-browser.panel', 'file-browser:add-item', path, "file");
            })
            .on('unlink', function(path) {
                Editor.sendToPanel('file-browser.panel', 'file-browser:delete-item', path);
            })
            .on('addDir', function(path) {
                Editor.sendToPanel('file-browser.panel', 'file-browser:add-item', path, "dir");
            })
            .on('unlinkDir', function(path) {
                Editor.sendToPanel('file-browser.panel', 'file-browser:delete-item', path);
            });
    },

    'file-browser:open': function() {
        Editor.Panel.open('file-browser.panel');
    }
};
