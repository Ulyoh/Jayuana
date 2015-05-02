
J = (function(){
  "use strict";
  var J = function () {
    if (this instanceof J){

    }
    else if (J.db === undefined){
      J.db = new Mongo.Collection("jayuanaDb");
      //TODO : create folders of C.FILES_FOLDER path
      //TODO : verify that any modifying file inside the folder will not
      //TODO : restart the server (path must begin with a dot)
    }
    else{
      throw J.error("J", "called twice");
    }
  };

  // METHODS:
  J.prototype = {};

  // STATICS METHODS:
  J.add = function(obj, type, name, start, callback){
    var objUnderTest, element, id, data, filePath;
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

    id = J.db.insert(element);
    filePath = process.env.PWD + "/" + C.FILES_FOLDER + id;

    fs.writeFile(filePath, data, Meteor.bindEnvironment(function (e) {
      if (e) {
        J.db.remove(id);
        throw J.error("J.add", "writeFile: " + e.message);
      }
      else{
        console.log("successfully wrote: " + filePath);
        J.db.update({_id: id},{$set: {
          available: true,
          path: filePath}});

        callback(id);
      }
    }));
  };

  return J;
})();

