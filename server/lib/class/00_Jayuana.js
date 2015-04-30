
J = (function(){
  "use strict";
  var J = function () {
    if (this instanceof J){

    }
    else if (J.db === undefined){
      J.db = new Mongo.Collection("jayuanaDb");
    }
    else{
      throw J.error("J", "called twice");
    }
  };

  // METHODS:
  J.prototype = {};

  // STATICS METHODS:
  J.add = function(obj, type, name, start, callback){
    var objUnderTest, element, id, data, fileName;
    var fs = Npm.require('fs');

    name = name || '';
    start = start || false;
    element = {
      name: name,
      type: type,
      start: start,
      available: false,
      path: 'unknown'
    };

    if((type !== "EJSON") && (type !== "code") && (type !== "file")){
      throw J.error("J.add", "type not defined correctly");
    }

    switch (type){
      case "EJSON":
        objUnderTest = obj;
        data = EJSON.stringify(obj);
        break;

      case "code":
        try{
          eval('objUnderTest = ' + obj); //jshint ignore:line
        }
        catch (e){
          throw J.error("J.add", "eval(): " + e.message);
        }

        break;

      case "file":

        break;
    }

    if (objUnderTest === undefined){
      throw J.error("J.add", "undefined object");
    }
    objUnderTest = undefined;

    id = J.db.insert(element);
    fileName = C.FILES_FOLDER + id;

    fs.writeFile(fileName, data, function (e) {
      if (e) {
        J.db.remove(id);
        throw J.error("J.add", "writeFile: " + e.message);
      }
      else{
        J.db.update({_id: id},{$set: {
          available: true,
          path: fileName}});

        callback(id);
      }
    });
  };

  return J;
})();

