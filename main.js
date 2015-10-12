/*global Editor */
var fs = require('fs')
var chokidar = require('chokidar');

rmDir = function(dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
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
    'file-browser:delete' : function(filepath){
        rmDir(filepath);
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
                Editor.sendToPanel('file-browser.panel', 'file-browser:add-item', path , "file");
            }.bind(this))
            .on('change', function(path) {
                log('File', path, 'has been changed');
            }.bind(this))
            .on('unlink', function(path) {
                log('File', path, 'has been removed');
                Editor.sendToPanel('file-browser.panel', 'file-browser:delete-item', path);
            }.bind(this))
            .on('addDir', function(path) {
                log('Directory', path, 'has been added');
                Editor.sendToPanel('file-browser.panel', 'file-browser:add-item', path, "dir");
            }.bind(this))
            .on('unlinkDir', function(path) {
                log('Directory', path, 'has been removed');
                Editor.sendToPanel('file-browser.panel', 'file-browser:delete-item', path);
            }.bind(this));
    },

    'file-browser:open': function() {
        Editor.Panel.open('file-browser.panel');
    }
};
