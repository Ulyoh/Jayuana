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
  evolvedPush: function (array, elt, propertyName, callback) {
    //var self = this;
    __.debounce(function () {
      elt[propertyName] = array.length;
      array.push(elt);
      callback();
    });
  }

};

Array.prototype.pushAnd =
  function(elt, propertyName, callback, callbackContext){
  var self = this;
  elt[propertyName] = self.length;
  self.push(elt);
  if (Match.test(callback, Function)){
    if(!callbackContext){
      callbackContext = self;
    }
    callback.call(callbackContext);
  }
  else if (!callback){
    throw new J.Error("Array.prototype.pushAnd", "invalid callback passed");
  }
};