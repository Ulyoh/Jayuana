
Jayuana = (function(){
  "use strict";
  var obj = function () {
    if (this instanceof obj){

    }
    else{
      Jayuana.db = new Mongo.Collection("jayuanaDb");
    }
  };

  obj.prototype = {};

  return obj;
})();