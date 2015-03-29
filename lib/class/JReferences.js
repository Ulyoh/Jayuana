/**
 * Created by yoh on 15-3-24.
 */

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
      var id = this._list[name];
      return (id === undefined)? false : true;
   };

   References.prototype.isIdIn = function (id) {

      var name = _.indexOf(this._list,
         function(elt){
            return (elt === id);
         });

      return (name === undefined)? false : true;
   };

/////////////////////////////////
///     private methods
////////////////////////////////
   References.prototype._getIndexById = function (id) {
      _.indexOf(this._list,
         function(elt){
            return (elt.id === id);
      });
   };

   References.prototype._getIndexByName = function (name) {
      _.indexOf(this._list,
         function(elt){
            return (elt.name === name);
         });
   };

/////////////////////////////////
///      class methods
////////////////////////////////
   References.patternOneRef = function(oneRef) {
      return (Match.test(oneRef, Object) && oneRef.name &&
      oneRef.id && Match.test(oneRef.name, String) &&
      Match.test(oneRef.id, String));
   };

   References.patternArg = function (arrayOrOneRef){
      if(!Match.test(arrayOrOneRef, Array)){
         arrayOrOneRef[0] = arrayOrOneRef;
      }
      return arrayOrOneRef.every(References.patternOneRef());
   };

   return References;
})();
