/**
 * Created by yoh on 15-3-24.
 */

  //TODO: replace id in each reference by dbId
  //TODO: replace name in each reference by refName
  //TODO: create a reference constructor

"use strict";

J.References = (function () {
  var References = function (refArrayOrOne, callback) {
    var self = this;
    var refArray = [];
    var length = -1;
    var last = -1;
    var cleanRefs;

    self.objType = "J.References";

    if (refArrayOrOne === undefined) {
      throw new J.Error("References constructor", "missing argument");
    }

    // if the callback provided is not a Function, throw an error
    //TODO: related test
    if((callback !== undefined) && (!Match.test(callback, Function))){
      throw new J.Error("References constructor", "invalid callback");
    }

    self._list = [];
    self._stackNewRefs = []; //TODO: add test for the use of it

    if (refArrayOrOne !== null) {
      if (!Match.test(refArrayOrOne, Array)) {
        refArray[0] = refArrayOrOne;
      }
      else {
        refArray = refArrayOrOne;
      }
      last = refArray.length - 1;

      refArray.forEach(function (element, index) {
        cleanRefs.push(References._cleanRef(element));
      });

      self._stackNewRefs.push({ref: cleanRefs, callback: callback});
      self._stackTreatment();
    }
  };

  References.prototype.add = function (ref, callback) {
    var self = this;
    var cleanRef;

    cleanRef = References._cleanRef(ref);

    self._stackNewRefs.push({ref: cleanRef, callback: callback});
    self._stackTreatment();
  };

  //TODO: create specifics test for cleanRef
  References._cleanRef = function (ref) {
    var cleanRef = {};
    //var self = this;
    if (Match.test(ref, Object) && ref.refName && ref.dbId &&
      Match.test(ref.refName, String) && Match.test(ref.dbId, String)) {
      cleanRef.dbId = ref.dbId;
      cleanRef.refName = ref.refName;

      return cleanRef; //TODO create test for refIndex
    }
    else {
      throw new J.Error("References add", "invalid or not object " +
        "passed to add method");
    }
  };

  References.prototype._stackTreatment = __.debounce(function () {
    var self = this;
    var newRefs, newRefInfos;
    var callback = function(){};
    while(newRefs = self._stackNewRefs[0]){
      callback = function(){};
      while(newRefInfos = newRefs[0]){
        newRefInfos.refIndex = self._list.length;
        self._list.push(newRefInfos.ref);
        callback = newRefInfos.callback;
        newRefs.shift();
      }
      callback(); //to have the callback called just after the related ref are
      //added and before other are added;
      self._stackNewRefs.shift();
    }
  });

  References.prototype.getDbIdByRefName = function (refName) {
    var index;
    var self = this;
    if (!Match.test(refName, String)) {
      throw new J.Error("References", "method getDbIdByRefName: argument is " +
        "not a string");
    }
    index = self._getIndexByRefName(refName);
    if (index === -1) {
      throw new J.Error(
        "References", "method getDbIdByRefName: refName not found");
    }
    return self._list[index].dbId;
  };

  References.prototype.getRefNameByDbId = function (dbId) {
    var index;
    var self = this;
    if (!Match.test(dbId, String)) {
      throw new J.Error("References", "method getRefNameByDbId: argument is " +
        "not a string");
    }
    index = self._getIndexByDbId(dbId);
    if (index === -1) {
      throw new J.Error("References",
        "method getRefNameByDbId: dbId not found");
    }
    return self._list[index].refName;
  };

  References.prototype.isRefNameIn = function (refName) {
    var self = this;
    return self._getIndexByRefName(refName) >= 0;
  };

  References.prototype.isDbIdIn = function (dbId) {
    var self = this;
    return self._getIndexByDbId(dbId) >= 0;
  };

  References.prototype.removeByDbId = function (dbId) {
    var index;
    var self = this;
    if (!Match.test(dbId, String)) {
      throw new J.Error("References", "method removeByDbId: dbId argument is" +
        " not a string");
    }

    index = self._getIndexByDbId(dbId);
    if (index === -1) {
      throw new J.Error("References", "method removeByDbId: dbId not found");
    }
    self._list[index] = undefined;
  };

  References.prototype.removeByRefName = function (refName) {
    var index;
    var self = this;
    if (!Match.test(refName, String)) {
      throw new J.Error(
        "References", "method removeByRefName: argument is not a string");
    }

    index = self._getIndexByRefName(refName);
    if (index === -1) {
      throw new J.Error(
        "References", "method removeByRefName: refName not found");
    }
    self._list[index] = undefined;
  };

  /////////////////////////////////
  ///     private methods
  ////////////////////////////////
  References.prototype._getIndexBy = function (property, value) {
    var self = this;
    for (var i = self._list.length - 1; i >= 0; i--) {
      if (self._list[i][property] === value) {
        return i;
      }
    }
    return -1;
  };

  References.prototype._getIndexByDbId = function (dbId) {
    var self = this;
    return self._getIndexBy("dbId", dbId);
  };

  References.prototype._getIndexByRefName = function (refName) {
    var self = this;
    return self._getIndexBy("refName", refName);
  };

  /////////////////////////////////
  ///      class methods
  ////////////////////////////////
  References.patternOneRef = function (oneRef) {
    /*return (Match.test(oneRef, Object) && oneRef.refName &&
     oneRef.dbId && Match.test(oneRef.refName, String) &&
     Match.test(oneRef.dbId, String));*/
    return Match.test(oneRef, Match.ObjectIncluding(
      {dbId: String, refName: String}));
  };

  References.patternArg = function (arrayOrOneRef) {
    if (!Match.test(arrayOrOneRef, Array)) {
      arrayOrOneRef[0] = arrayOrOneRef;
    }
    return arrayOrOneRef.every(References.patternOneRef());
  };

  return References;
})();
