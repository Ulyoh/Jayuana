/**
 * Created by yoh on 5/10/15.
 */
utils = {
  fs: Npm.require('fs'),

  _emptyDirectory: function (target) {
    utils.fs.readdirSync(target).forEach(function (element) {
      utils._rm(target + "/" + element);
    });
  },

  _rm: function (target) {
    if (utils.fs.statSync(target).isDirectory()){
      utils._emptyDirectory(target);
      utils.fs.rmdirSync(target);
    }
    else{
      utils.fs.unlinkSync(target);
    }
  },

  verbose: function(text) {
    if (C.VERBOSE) {
      console.log(text);
    }
  },

  v: function(text){
    var self = this;
    return self.verbose(text);
  },

  //todo: check parameters
  evolvedPush: function (array, elt, propertyName) {
    __.debounce(function () {
      elt[propertyName] = array.length;
      array.push(elt);
    });
  }

};