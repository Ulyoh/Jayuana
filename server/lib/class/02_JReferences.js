  /**
  * Created by yoh on 15-3-24.
  */

  //TODO: replace id in each reference by dbId
  //TODO: replace name in each reference by localName
  //TODO: create a reference constructor

  "use strict";

J.References = (function () {
  var References = function (refArrayOrOne) {
    var self = this;
    var refArray = [];

    self.objType = "J.References";

    if (refArrayOrOne === undefined){
       throw new J.Error("References constructor", "missing argument");
    }

    self._list = [];

    if (refArrayOrOne !== null) {
       if (!Match.test(refArrayOrOne, Array)) {
          refArray[0] = refArrayOrOne;
       }
       else {
          refArray = refArrayOrOne;
       }
       refArray.forEach(self.add, self);
    }
  };

  References.prototype.add = function(ref){
    var cleanRef = {};
    var self = this;
    if (Match.test(ref, Object) && ref.name && ref.dbId &&
       Match.test(ref.name, String) && Match.test(ref.dbId, String)) {
       cleanRef.dbId = ref.dbId;
       cleanRef.name = ref.name;
      self._list.push(cleanRef);
    }
    else{
       throw new J.Error("References add", "invalid or not object " +
       "passed to add method");
    }
  };

  References.prototype.removeByDbId = function (dbId) {
    var index;
    var self = this;
    if (!Match.test(dbId, String)){
       throw new J.Error("References", "method removeByDbId: dbId argument is" +
         " not a string");
    }

    index = self._getIndexByDbId(dbId);
    if (index === -1){
       throw new J.Error("References", "method removeByDbId: dbId not found");
    }
    self._list[index] = undefined;
  };

  References.prototype.removeByName = function (name) {
    var index;
    var self = this;
    if (!Match.test(name, String)){
       throw new J.Error("References", "method removeByName: argument is " +
       "not a string");
    }

    index = self._getIndexByName(name);
    if (index === -1){
       throw new J.Error("References", "method removeByName: name not found");
    }
    self._list[index] = undefined;
  };

  References.prototype.getDbIdByName = function(name){
    var index;
    var self = this;
    if (!Match.test(name, String)){
       throw new J.Error("References", "method getDbIdByName: argument is " +
       "not a string");
    }
    index = self._getIndexByName(name);
    if (index === -1){
       throw new J.Error("References", "method getDbIdByName: name not found");
    }
    return self._list[index].dbId;
  };

  References.prototype.getNameById = function (dbId) {
    var index;
    var self = this;
    if (!Match.test(dbId, String)){
       throw new J.Error("References", "method getNameById: argument is " +
       "not a string");
    }
    index = self._getIndexByDbId(dbId);
    if (index === -1){
       throw new J.Error("References", "method getNameById: dbId not found");
    }
    return self._list[index].name;
  };

  References.prototype.isNameIn = function (name) {
    var self = this;
    return self._getIndexByName(name) >= 0;
  };

  References.prototype.isIdIn = function (dbId) {
    var self = this;
    return self._getIndexByDbId(dbId) >= 0;
  };

  /////////////////////////////////
  ///     private methods
  ////////////////////////////////
  References.prototype._getIndexBy = function (property, value) {
    var self = this;
    for( var i = self._list.length - 1; i >= 0; i--){
       if(self._list[i][property] === value){
          return i;
       }
    }
    return -1;
  };

  References.prototype._getIndexByDbId = function (dbId) {
    var self = this;
    return self._getIndexBy("dbId", dbId);
  };

  References.prototype._getIndexByName = function (name) {
    var self = this;
    return self._getIndexBy("name", name);
  };

  /////////////////////////////////
  ///      class methods
  ////////////////////////////////
  References.patternOneRef = function(oneRef) {
    /*return (Match.test(oneRef, Object) && oneRef.name &&
    oneRef.dbId && Match.test(oneRef.name, String) &&
    Match.test(oneRef.dbId, String));*/
    return Match.test(oneRef, Match.ObjectIncluding(
       {dbId: String, name: String}));
  };

  References.patternArg = function (arrayOrOneRef){
    if(!Match.test(arrayOrOneRef, Array)){
       arrayOrOneRef[0] = arrayOrOneRef;
    }
    return arrayOrOneRef.every(References.patternOneRef());
  };

  return References;
})();
