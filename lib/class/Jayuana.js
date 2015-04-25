
Jayuana = (function(){
  "use strict";
  var obj = function () {
    if (this instanceof obj){

    }
    else if (Jayuana.db === undefined){
      obj.db = new Mongo.Collection("jayuanaDb");
    }
    else{
      J.error("Jayuana", "called twice");
    }
  };

  // STATICS METHODS:
  obj.add = function(obj, type, name, start){
    name = name || '';
    start = start || false;
    var element = {
      name: name,
      type: type,
      obj: obj,
      start: start
    };

    if (type === "EJSON"){
      return Jayuana.db.insert(element);
    }
    else if (type === "code"){

    }
    else if (type === "file"){

    }
    else{
      J.error("Jayuana.add", "type not defined correctly");
    }
  };

  obj.prototype = {};

  return obj;
})();

