/**
 * Created by yoh on 5/10/15.
 */

//to avoid JSDocs warnings:
utils = {
  fs: {
    mkdirSync: function () {
    },
    readdirSync: function () {
    },
    existsSync: function () {
    },
    readFileSync: function () {
    },
    statSync: function () {
    },
    rmdirSync: function () {
    },
    unlinkSync: function () {
    }
  },
  env:{
    PWD:""
  }
};

var fs = Npm.require('fs');
utils = {
  env: process.env,
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
                             generateIdFunc, previousGenerateFunc) {
    var newElt;
    var callback;
    var id = -1;

    while( newElt = stack.shift()){
      callback = null;
      //newValues.refs[0]
      if (previousGenerateFunc){
        previousGenerateFunc(newElt.valueToAdd);
      }

      id = generateIdFunc();
      newElt.valueToAdd[idPropertyName] = id;
      array[id] = newElt.valueToAdd;
      //TODO create test for refId
      if (newElt.callback){
        callback = newElt.callback.bind(thisObj);
      }
      if (callback){
        callback(); //to have the callback called just after the related ref are
        //added and before other are added;
      }
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