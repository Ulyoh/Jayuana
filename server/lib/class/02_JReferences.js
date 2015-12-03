/**
 * Created by yoh on 15-3-24.
 */
  //TODO: supprimer tout les activeId, remplacer par JId
  //TODO: ajouter une reference directe au Jayuana
  //TODO: create a reference constructor
  //TODO: only one activeId allowed by References list
  //TODO: add getByDbId and getByNameId, return an array or null

"use strict";

J.References = (function () {
  /**
   *  To create the References list object
   *  To create an empty one use null as refArrayOrOne
   *
   * @param {Array.<newJRefForActiveJ> | newJRefForActiveJ | null} refArrayOrOne
   * @param {callback} [callback]
   * @constructor
   */
  var References;
  References = function (refArrayOrOne, callback) {

    if (!(this instanceof References)){
      throw new J.Error("References constructor", "called without new keyword");
    }

    var self = this;
    var refArray = [];
    var cleanRefs = [];

    self.objType = "J.References";

    if (refArrayOrOne === undefined) {
      throw new J.Error("References constructor", "missing argument");
    }

    // if the callback provided is not a Function, throw an error
    //TODO: related test
    if ((callback !== undefined) && (!Match.test(callback, Function))) {
      throw new J.Error("References constructor", "invalid callback");
    }

    self._rList = [];
    self._rStackRefsToAdd = []; //TODO: add test for the use of it
    self.rNextRefId = 0;  //TODO: create tests of refId

    if (refArrayOrOne !== null) {
      //TODO: rAdd should be used here, no?
      if (!Match.test(refArrayOrOne, Array)) {
        refArray[0] = refArrayOrOne;
      }
      else {
        refArray = refArrayOrOne;
      }

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
  /**
   * Add a reference
   * return true if success
   *
   * @param {newJRefForActiveJ} ref
   * @param {callback} callback
   * @return {boolean}
   */
  References.prototype.rAdd = function (ref, callback) {
    var self = this;
    var cleanRefs = [];

    cleanRefs[0] = References._rCleanRef(ref);

    self._rStackRefsToAdd.push({ref: cleanRefs, callback: callback});
    self._rStackTreatment();
    return true;
  };

  /**
   * Get activeId by reference name
   *
   * @param {string} refName
   * @returns {string | null}
   */

  References.prototype.rGetActiveIdByRefName = function (refName) {
    var index;
    var self = this;
    if (!Match.test(refName, String)) {
      throw new J.Error("References", "method rGetActiveIdByRefName: argument" +
        " is not a string");
    }
    index = self._rGetIndexByRefName(refName);
    if (index === -1) {
      return null;
    }
    return self._rList[index]._rActiveId;
  };

  /**
   * Get reference name by activeId
   *
   * @param {string} activeId
   * @returns {string | null}
   */
  References.prototype.rGetRefNameByActiveId = function (activeId) {
    var index;
    var self = this;
    if (!Match.test(activeId, Number)) {
      throw new J.Error("References", "method rGetRefNameByActiveId: argument" +
        " is not a Number");
    }
    index = self._rGetIndexByActiveId(activeId);
    if (index === -1) {
      return null;
    }
    return self._rList[index].rRefName;
  };

  /**
   * Is the string is a reference's name?
   *
   * @param {string} refName
   * @returns {boolean}
   */
  References.prototype.rIsRefNameIn = function (refName) {
    var self = this;
    return self._rGetIndexByRefName(refName) >= 0;
  };

  /**
   * Is the string is an activeId of one of the references
   *
   * @param {string} activeId
   * @returns {boolean}
   */

  References.prototype.rIsActiveIdIn = function (activeId) {
    var self = this;
    return self._rGetIndexByActiveId(activeId) >= 0;
  };

  /**
   * Remove a reference by activeId
   * return false if not found
   *
   * @param {string} activeId
   * @returns {boolean}
   */
  References.prototype.rRemoveByActiveId = function (activeId) {
    var index;
    var self = this;
    if (!Match.test(activeId, String)) {
      throw new J.Error("References", "method rRemoveByActiveId: activeId " +
        "argument is not a string");
    }

    index = self._rGetIndexByActiveId(activeId);
    if (index === -1) {
      return false;
    }
    self._rList[index] = undefined;
    return true;
  };

  /**
   * Remove a reference by activeId
   * return false if not found
   *
   * @param {string} refName
   * @returns {boolean}
   */
  References.prototype.rRemoveByRefName = function (refName) {
    var index;
    var self = this;
    if (!Match.test(refName, String)) {
      throw new J.Error(
        "References", "method rRemoveByRefName: argument is not a string");
    }

    index = self._rGetIndexByRefName(refName);
    if (index === -1) {
      return false;
    }
    self._rList[index] = undefined;
    return true;
  };

  /**#@-*/
  /**#@+
   * @private
   */

  /**
   *
   * @param {string} property
   * @param {string} value
   * @returns {number}
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

  /**
   *
   * @param {string} activeId
   * @returns {number}
   * @private
   */
  References.prototype._rGetIndexByActiveId = function (activeId) {
    var self = this;
    return self._rGetIndexBy("_rActiveId", activeId);
  };

  /**
   *
   * @param {string} refName
   * @returns {number}
   * @private
   */
  References.prototype._rGetIndexByRefName = function (refName) {
    var self = this;
    return self._rGetIndexBy("rRefName", refName);
  };

  /**
   *
   * @type {Function}
   * @private
   */
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
  /**
   *
   * @param oneRef
   * @returns {boolean}
   * @static
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
  /**
   *
   * @param {newJRefForActiveJ} ref
   * @returns {cleanJRef}
   * @static
   * @private
   *
   */
  References._rCleanRef = function (ref) {
    /** @type {cleanJRef} */
    var cleanRef;

    /** @type {J} */
    var elt;

    //looking for the Jayuana object

    if (ref.JIdOrName.ActiveId) {
      elt = J._jActivated[ref.JIdOrName.ActiveId];
    }
    else if (ref.JIdOrName.ActiveName ){
      elt = J.jGetActiveByActiveName(ref.JIdOrName.ActiveName);
    }
    else{
      throw new J.Error("References _rCleanRef", "invalid or not object " +
        "passed to _rCleanRef method");
    }

    cleanRef = {
      rRefName: ref.newRefName || elt.jGetActiveName(),
      _rActiveId: elt.jGetActiveId(),
      rActiveName: elt.jGetActiveName(),
      rDbId: elt.jGetDbId(),
      rDbName:  elt.jGetDbName(),
      rActiveElt: elt
    };

    return cleanRef;
  };

  /**#@-*/

  return References;
})();
