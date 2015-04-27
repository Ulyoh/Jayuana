/**
 * Created by yoh on 15-3-24.
 */

"use strict";

J.References = (function () {
   var References = function (refArrayOrOne) {
      var refArray = [];
      if (!refArrayOrOne){
         throw J.error("References constructor", "missing argument");
      }
      else if(!Match.test(refArrayOrOne, Array)){
         refArray[0] = refArrayOrOne;
      }
      else{
         refArray = refArrayOrOne;
      }
      this._list = [];
      refArray.forEach(this.add, this);
   };

   References.prototype.add = function(ref){
      var cleanRef = {};
      if (Match.test(ref, Object) && ref.name && ref.id &&
         Match.test(ref.name, String) && Match.test(ref.id, String)) {
         cleanRef.id = ref.id;
         cleanRef.name = ref.name;
         this._list.push(cleanRef);
      }
      else{
         throw J.error("References add", "invalid or not object " +
         "passed to add method");
      }
   };

   References.prototype.removeById = function (id) {
      var index;
      if (!Match.test(id, String)){
         throw J.error("References", "method removeById: id argument is " +
         "not a string");
      }

      index = this._getIndexById(id);
      if (index === -1){
         throw J.error("References", "method removeById: id not found");
      }
      this._list[index] = undefined;
   };

   References.prototype.removeByName = function (name) {
      var index;
      if (!Match.test(name, String)){
         throw J.error("References", "method removeByName: argument is " +
         "not a string");
      }

      index = this._getIndexByName(name);
      if (index === -1){
         throw J.error("References", "method removeByName: name not found");
      }
      this._list[index] = undefined;
   };

   References.prototype.getIdByName = function(name){
      var index;
      if (!Match.test(name, String)){
         throw J.error("References", "method getIdByName: argument is " +
         "not a string");
      }
      index = this._getIndexByName(name);
      if (index === -1){
         throw J.error("References", "method getIdByName: name not found");
      }
      return this._list[index].id;
   };

   References.prototype.getNameById = function (id) {
      var index;
      if (!Match.test(id, String)){
         throw J.error("References", "method getNameById: argument is " +
         "not a string");
      }
      index = this._getIndexById(id);
      if (index === -1){
         throw J.error("References", "method getNameById: id not found");
      }
      return this._list[index].name;
   };

   References.prototype.isNameIn = function (name) {
      return this._getIndexByName(name) >= 0;
   };

   References.prototype.isIdIn = function (id) {
      return this._getIndexById(id) >= 0;
   };

/////////////////////////////////
///     private methods
////////////////////////////////
   References.prototype._getIndexBy = function (property, value) {
      for( var i = this._list.length - 1; i >= 0; i--){
         if(this._list[i][property] === value){
            return i;
         }
      }
      return -1;
   };

   References.prototype._getIndexById = function (id) {
      return this._getIndexBy("id", id);
   };

   References.prototype._getIndexByName = function (name) {
      return this._getIndexBy("name", name);
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
