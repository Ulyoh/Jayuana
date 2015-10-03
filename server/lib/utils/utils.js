/**
 * Created by yoh on 5/10/15.
 */

var fs = Npm.require('fs');
utils = {
  fs: fs,

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

  verbose: function(text, force) {
    if ((C.VERBOSE === true && force === undefined ) || force === true) {
      console.log(text);
    }
  },

  v: function(text, force){
    var self = this;
    return self.verbose(text, force);
  },

  addStackToArray: function (thisObj, array, stack, idPropertyName,
                             generateIdFunc) {
    var newValues, newValue;
    var callback;
    var id = -1;

    while(newValues = stack[0]){
      callback = null;

      while( newValue = newValues.refs[0]){
        id = generateIdFunc();
        newValue[idPropertyName] = id;
        array[id] = newValue; //TODO create test for refId
        if (newValues.callback){
          callback = newValues.callback.bind(thisObj);
        }
        newValues.refs.shift();
      }

      if (callback){
        callback(); //to have the callback called just after the related ref are
        //added and before other are added;
      }
      stack.shift();
    }
  }
};

//TODO: remove if not used

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