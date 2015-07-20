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

    self._rList = [];
    self._rStackRefsToAdd = []; //TODO: add test for the use of it
    self.rNextRefId = 0;  //TODO: create tests of refId

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

      self._rStackRefsToAdd.push({refs: cleanRefs, callback: callback});
      self._rStackTreatment();
    }
  };

  /**#@+
   * @public
   */

  References.prototype.rAdd = function (ref, callback) {
    var self = this;
    var cleanRefs = [];

    cleanRefs[0] = References._rCleanRef(ref);

    self._rStackRefsToAdd.push({ref: cleanRefs, callback: callback});
    self._rStackTreatment();
  };

  References.prototype.rGetActiveIdByRefName = function (refName) {
    var index;
    var self = this;
    if (!Match.test(refName, String)) {
      throw new J.Error("References", "method rGetActiveIdByRefName: argument" +
        " is not a string");
    }
    index = self._rGetIndexByRefName(refName);
    if (index === -1) {
      throw new J.Error(
        "References", "method rGetActiveIdByRefName: refName not found");
    }
    return self._rList[index]._rActiveId;
  };

  References.prototype.rGetRefNameByActiveId = function (activeId) {
    var index;
    var self = this;
    if (!Match.test(activeId, Number)) {
      throw new J.Error("References", "method rGetRefNameByActiveId: argument" +
        " is not a Number");
    }
    index = self._rGetIndexByActiveId(activeId);
    if (index === -1) {
      throw new J.Error("References",
        "method rGetRefNameByActiveId: activeId not found");
    }
    return self._rList[index].rRefName;
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
      throw new J.Error("References", "method rRemoveByActiveId: activeId " +
        "argument is not a string");
    }

    index = self._rGetIndexByActiveId(activeId);
    if (index === -1) {
      throw new J.Error("References", "method rRemoveByActiveId: activeId not" +
        " found");
    }
    self._rList[index] = undefined;
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
    self._rList[index] = undefined;
  };

  /**#@-*/
  /**#@+
   * @private
   */

  References.prototype._rGetIndexBy = function (property, value) {
    var self = this;
    for (var i = self._rList.length - 1; i >= 0; i--) {
      if (self._rList[i][property] === value) {
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
    return self._rGetIndexBy("rRefName", refName);
  };

  References.prototype._rStackTreatment = __.debounce(function () {
    var self = this;

    utils.addStackToArray(self, self._rList, self._rStackRefsToAdd, "_rRefId",
      function () {
        return self.rNextRefId++;
      });
  });

  //////////// STATICS METHODS  /////////////////////

  /**#@+
   * @public
   */

  References.rPatternOneRef = function (oneRef) {
    /*return (Match.test(oneRef, Object) && oneRef.rRefName &&
     oneRef.refActiveId && Match.test(oneRef.rRefName, String) &&
     Match.test(oneRef.refActiveId, String));*/
    return Match.test(oneRef, Match.ObjectIncluding(
      {  rRefName: String,
        rActiveElt: J,
        _rRefId: Number,
        _rActiveId: String}));
  };

  References.rPatternArg = function (arrayOrOneRef) {
    if (!Match.test(arrayOrOneRef, Array)) {
      arrayOrOneRef[0] = arrayOrOneRef;
    }
    return arrayOrOneRef.every(References.rPatternOneRef());
  };

  /**#@-*/
  /**#@+
   * @private
   */
  //TODO: create specifics test for cleanRef
  References._rCleanRef = function (ref) {
    var cleanRef = {};
    //var self = this;
    if (Match.test(ref, Object) && ref.newRefName && ref.newActiveElt &&
      Match.test(ref.newRefName, String) && Match.test(ref.newActiveElt, J)) {
      cleanRef.rRefName = ref.newRefName; //rename ref.rRefName by ref.rNewRefName
      cleanRef.rActiveElt = ref.newActiveElt; //same as above
      cleanRef._rActiveId = ref.newActiveElt._jActiveId;

      return cleanRef;
    }
    else {
      throw new J.Error("References rAdd", "invalid or not object " +
        "passed to rAdd method");
    }
  };

  /**#@-*/

  return References;
})();
