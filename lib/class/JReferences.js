/**
 * Created by yoh on 15-3-24.
 */

J.References = (function () {
   var References = function (refArrayOrOne) {
      if (!refArrayOrOne){
         throw J.error("References constructor", "missing argument");
      }
      else if(!Match.test(refArrayOrOne, Array)){
         refArrayOrOne[0] = refArrayOrOne;
      }
      this._list = [];
      refArrayOrOne.forEach(this.add());
   };

   References.prototype.add = function(ref){
      if (Match.test(ref, Object) && ref.name && ref.id &&
         Match.test(ref.name, String) && Match.test(ref.id, String)) {
         this._list[ref.name] = ref.id;
      }
      else{
         throw J.prototype.error("References add", "invalid or not object " +
         "passed to add method");
      }
   };

   References.prototype.remove = function (id) {
      if (!Match.test(id, String)){
         throw J.error("References", "method remove: id parameter is " +
         "not a string");
      }
      if (!this.isIdIn(id)){
         throw J.error("Reference", "method remove: id not found");
      }
      this._list[this.getName(id)] = undefined;

   };

   References.prototype.getId = function(name){
      if(!this._list[name]){
         throw J.error();
      }
      return this._list[name];
   };

   References.prototype.getName = function (id) {
      var name = _.findIndex(this._list,
         function(elt){
            return (elt === id);
         });

      if(name === undefined){
         throw J.error();
      }

      return name;
   };

   References.prototype.isNameIn = function (name) {
      var id = this._list[name];
      return (id === undefined)? false : true;
   };

   References.prototype.isIdIn = function (id) {

      var name = _.findIndex(this._list,
         function(elt){
            return (elt === id);
         });

      return (name === undefined)? false : true;
   };

/////////////////////////////////
///     class properties
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
