/**
 * Created by yoh on 15-3-24.
 */
  //TODO: supprimer tout les activeId, remplacer par JId
  //TODO: ajouter une reference directe au Jayuana
  //TODO: create a reference constructor

"use strict";

J.References = (function () {
  var References = function (refArrayOrOne, callback) {
    var self = this;
    var refArray = [];
    var last = -1;
    var cleanRefs =[];

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
    self.nextRefId = 0;  //TODO: create tests of refId

    if (refArrayOrOne !== null) {
      if (!Match.test(refArrayOrOne, Array)) {
        refArray[0] = refArrayOrOne;
      }
      else {
        refArray = refArrayOrOne;
      }
      last = refArray.length - 1;

      refArray.forEach(function (element) {
        cleanRefs.push(References._rCleanRef(element));
      });

      self._stackNewRefs.push({refs: cleanRefs, callback: callback});
      self._rStackTreatment();
    }
  };

  References.prototype.rAdd = function (ref, callback) {
    var self = this;
    var cleanRefs = [];

    cleanRefs[0] = References._rCleanRef(ref);

    self._stackNewRefs.push({ref: cleanRefs, callback: callback});
    self._rStackTreatment();
  };

  References.prototype.rGetActiveIdByRefName = function (refName) {
    var index;
    var self = this;
    if (!Match.test(refName, String)) {
      throw new J.Error("References", "method rGetActiveIdByRefName: argument is " +
        "not a string");
    }
    index = self._rGetIndexByRefName(refName);
    if (index === -1) {
      throw new J.Error(
        "References", "method rGetActiveIdByRefName: refName not found");
    }
    return self._list[index].refActiveId;
  };

  References.prototype.rGetRefNameByActiveId = function (activeId) {
    var index;
    var self = this;
    if (!Match.test(activeId, String)) {
      throw new J.Error("References", "method rGetRefNameByActiveId: argument is " +
        "not a string");
    }
    index = self._rGetIndexByActiveId(activeId);
    if (index === -1) {
      throw new J.Error("References",
        "method rGetRefNameByActiveId: activeId not found");
    }
    return self._list[index].refName;
  };

  References.prototype.rIsRefNameIn = function (refName) {
    var self = this;
    return self._rGetIndexByRefName(refName) >= 0;
  };

  References.prototype.rIsActiveIdIn = function (activeId) {
    var self = this;
    return self._rGetIndexByActiveId(activeId) >= 0;
  };

  References.prototype.rRemoveByActiveId = function (activeId) {
    var index;
    var self = this;
    if (!Match.test(activeId, String)) {
      throw new J.Error("References", "method rRemoveByActiveId: activeId argument is" +
        " not a string");
    }

    index = self._rGetIndexByActiveId(activeId);
    if (index === -1) {
      throw new J.Error("References", "method rRemoveByActiveId: activeId not found");
    }
    self._list[index] = undefined;
  };

  References.prototype.rRemoveByRefName = function (refName) {
    var index;
    var self = this;
    if (!Match.test(refName, String)) {
      throw new J.Error(
        "References", "method rRemoveByRefName: argument is not a string");
    }

    index = self._rGetIndexByRefName(refName);
    if (index === -1) {
      throw new J.Error(
        "References", "method rRemoveByRefName: refName not found");
    }
    self._list[index] = undefined;
  };

  /////////////////////////////////
  ///     private methods
  ////////////////////////////////

  References.prototype._rGetIndexBy = function (property, value) {
    var self = this;
    for (var i = self._list.length - 1; i >= 0; i--) {
      if (self._list[i][property] === value) {
        return i;
      }
    }
    return -1;
  };

  References.prototype._rGetIndexByActiveId = function (activeId) {
    var self = this;
    return self._rGetIndexBy("_rActiveId", activeId);
  };

  References.prototype._rGetIndexByRefName = function (refName) {
    var self = this;
    return self._rGetIndexBy("refName", refName);
  };

  References.prototype._rStackTreatment = __.debounce(function () {
    var self = this;
    var newRefs, newRef;
    var callback;
    var refId;
    while(newRefs = self._stackNewRefs[0]){
      callback = null;
      while( newRef = newRefs.refs[0]){
        refId = self.nextRefId++;
        newRef.refId = refId;
        self._list.push(newRef); //TODO create test for refId
        if (newRefs.callback){
          callback = newRefs.callback.bind(self);
        }
        newRefs.refs.shift();
      }

      if (callback){
        callback(); //to have the callback called just after the related ref are
        //added and before other are added;
      }

      self._stackNewRefs.shift();
    }
  });
  /////////////////////////////////
  ///      class methods
  ////////////////////////////////
  References.rPatternOneRef = function (oneRef) {
    /*return (Match.test(oneRef, Object) && oneRef.refName &&
     oneRef.refActiveId && Match.test(oneRef.refName, String) &&
     Match.test(oneRef.refActiveId, String));*/
    return Match.test(oneRef, Match.ObjectIncluding(
      {activeId: String, refName: String}));
  };

  References.rPatternArg = function (arrayOrOneRef) {
    if (!Match.test(arrayOrOneRef, Array)) {
      arrayOrOneRef[0] = arrayOrOneRef;
    }
    return arrayOrOneRef.every(References.rPatternOneRef());
  };



  //TODO: create specifics test for cleanRef
  References._rCleanRef = function (ref) {
    var cleanRef = {};
    //var self = this;
    if (Match.test(ref, Object) && ref.refName && ref.ref &&
      Match.test(ref.refName, String) && Match.test(ref.ref, J)) {
      cleanRef.refName = ref.refName;
      cleanRef.ref = ref.ref;
      cleanRef._rActiveId = ref.ref._activeId;

      return cleanRef;
    }
    else {
      throw new J.Error("References rAdd", "invalid or not object " +
        "passed to rAdd method");
    }
  };


  return References;
})();
