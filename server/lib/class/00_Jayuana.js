
J = (function(){
  "use strict";
  var J = function (element) {
    if (this instanceof J){
      var self = this;

      if (!element){
        throw J.Error("J.constructor", "no element passed");
      }
      if (!element.refsFrom){
        element.refsFrom = null;
      }
      if (!element.refsTo){
        element.refsTo = null;
      }

      J[element._id] = self;

      self._element = element;
      self._id = element._id;
      self._name = element.name;
      self._refsFrom = new J.References(element.refsFrom);
      self._refsTo = new J.References(element.refsTo);
      eval("element.obj =" + element.objToEval);  //jshint ignore: line
      self._obj = element.obj;

      J._activated.push(J._starter);
    }
    else{
      throw new J.Error("J", "must be called with the 'new' keyword");
    }
  };

  // METHODS:
  J.prototype = {};

  J.prototype.run = function(){
    console.log("+ start J.prototype.run");
    var self = this;
    self._obj();
    console.log("- end J.prototype.run");
  };

  // STATICS PROPERTIES:
  J._activated = [];

  // STATICS METHODS:
  J._starter = function(){};

  J.init = function (options) {
    console.log("+ start J.init()");
    var fs = Npm.require('fs');

    if (J.db === undefined) {
      J._rootPath = process.env.PWD + "/";

      if((options) && (options.folderName)){
        J._folderName = options.folderName + "/";
      }
      else{
        J._folderName = C.DEFAULT_FOLDER + "/";
      }

      try {
        fs.mkdirSync(J._rootPath + J._folderName);
      }
      catch(e){
        if (e.code !== 'EEXIST') {
          throw e;
        }
      }

      J.db = new Mongo.Collection("jayuanaDb");
      J.db.remove({});
      //TODO : verify that any modifying file inside the folder will not
      //TODO : restart the server (path must begin with a dot)
      console.log("- end J.init()");
    }
  };

  J.add = function(oneOreMoreElts, callback){
    var eltsDef = [];
    if (_.isArray(oneOreMoreElts)){
      eltsDef = oneOreMoreElts;
    }
    else{
      eltsDef[0] = oneOreMoreElts;
    }
    eltsDef.forEach(function (eltDef) {
      J._addOne(eltDef.obj, eltDef.type, eltDef.name, eltDef.start, callback);
    });
  };

  J._addOne = function(obj, type, name, start, callback){
    console.log("+ start J._addOne( " + name + " )");
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
      throw new J.Error("J.add", "type not defined correctly");
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
          throw new J.Error("J.add", "eval(): " + e.message);
        }
        data = obj;

        break;

      case "file":

        break;
    }

    if (objUnderTest === undefined){
      throw new J.Error("J.add", "undefined object");
    }

    if ((element.start === true) && !(_.isFunction(objUnderTest))){
      throw new J.Error("J.add",
        "start flag true and object is not a function");
    }

    id = J.db.insert(element);
    filePath = J._rootPath + J._folderName + id;

    fs.writeFile(filePath, data, Meteor.bindEnvironment(function (e) {
      if (e) {
        J.db.remove(id);
        //TODO : should not throw an Error but pass the Error to callback(e, id)
        //TODO : save it in a log
        throw new J.Error("J.add", "writeFile: " + e.message);
      }
      else{
        console.log("- end J.add( " + name + " )");
        J.db.update({_id: id},{$set: {
          available: true,
          path: filePath}});

        if (callback){
          callback(id);
        }
      }
    }));
  };

  J._getBy = function(condition, callback){
    var fs = Npm.require('fs');
    var element = J.db.findOne(condition);

    fs.readFile(element.path, {encoding: 'utf8'}, function (err, data){
      if(!err){
        element.objToEval = data;
      }
      if (callback){
        callback(err, element);
      }
    });
  };

  J.getById = function (id, callback) {
    J._getBy({_id: id }, callback);
  };

  J.getByName = function(name, callback) {
    J._getBy({name: name}, callback);
  };

  J.start = function(){
    console.log("+ start J.start()");
    J._getBy({start: true}, function (err, element) {
      if(err){
        throw err;
      }
      else{
        J._starter = new J(element);
        J._starter.run();
        console.log("- end J.start()");
      }
    });
  };

  return J;
})();

