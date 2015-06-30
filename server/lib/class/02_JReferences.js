  /**
  * Created by yoh on 15-3-24.
  */

  //TODO: replace id in each reference by idInDb
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
    if (Match.test(ref, Object) && ref.name && ref.id &&
       Match.test(ref.name, String) && Match.test(ref.id, String)) {
       cleanRef.id = ref.id;
       cleanRef.name = ref.name;
      self._list.push(cleanRef);
    }
    else{
       throw new J.Error("References add", "invalid or not object " +
       "passed to add method");
    }
  };

  References.prototype.removeById = function (id) {
    var index;
    var self = this;
    if (!Match.test(id, String)){
       throw new J.Error("References", "method removeById: id argument is " +
       "not a string");
    }

    index = self._getIndexById(id);
    if (index === -1){
       throw new J.Error("References", "method removeById: id not found");
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

  References.prototype.getIdByName = function(name){
    var index;
    var self = this;
    if (!Match.test(name, String)){
       throw new J.Error("References", "method getIdByName: argument is " +
       "not a string");
    }
    index = self._getIndexByName(name);
    if (index === -1){
       throw new J.Error("References", "method getIdByName: name not found");
    }
    return self._list[index].id;
  };

  References.prototype.getNameById = function (id) {
    var index;
    var self = this;
    if (!Match.test(id, String)){
       throw new J.Error("References", "method getNameById: argument is " +
       "not a string");
    }
    index = self._getIndexById(id);
    if (index === -1){
       throw new J.Error("References", "method getNameById: id not found");
    }
    return self._list[index].name;
  };

  References.prototype.isNameIn = function (name) {
    var self = this;
    return self._getIndexByName(name) >= 0;
  };

  References.prototype.isIdIn = function (id) {
    var self = this;
    return self._getIndexById(id) >= 0;
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

  References.prototype._getIndexById = function (id) {
    var self = this;
    return self._getIndexBy("id", id);
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
    oneRef.id && Match.test(oneRef.name, String) &&
    Match.test(oneRef.id, String));*/
    return Match.test(oneRef, Match.ObjectIncluding(
       {id: String, name: String}));
  };

  References.patternArg = function (arrayOrOneRef){
    if(!Match.test(arrayOrOneRef, Array)){
       arrayOrOneRef[0] = arrayOrOneRef;
    }
    return arrayOrOneRef.every(References.patternOneRef());
  };

  return References;
})();
