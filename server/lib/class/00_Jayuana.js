
J = (function(){
  "use strict";
  var J = function (element) {
    if (this instanceof J){
      var self = this;

      self.objType = "Jayuana";

      if (!element){
        throw J.Error("J.constructor", "no element passed");
      }
      if (!element.refsFrom){
        element.refsFrom = null;
      }
      if (!element.refsTo){
        element.refsTo = null;
      }

      //J[element._id] = self;

      self._element = element;
      self._id = element._id;
      self._name = element.name;
      self._refsFrom = new J.References(element.refsFrom);
      self._refsTo = new J.References(element.refsTo);
      eval("element.obj =" + element.objToEval);  //jshint ignore: line
      self._obj = element.obj;

      J._activated.push(self);
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

  J.prototype._addRef = function(ref, type, nameForOtherRef){
    var self = this;
    var otherJayuana = J.db.findOne({_id: ref.element._id});
    var localRef = {
      id: self._id,
      name: nameForOtherRef || (nameForOtherRef = self._name),
      element: self._element
    };
    switch(type){
      case 'to':
        self._refsTo.add(ref);
        otherJayuana._refsFrom.add(localRef);
        break;
      case 'from':
        otherJayuana._refsTo.add(localRef);
        self._refsFrom.add(ref);
        break;
      case 'both':
        self._refsTo.add(ref);
        self._refsFrom.add(ref);
        otherJayuana._refsTo.add(localRef);
        otherJayuana._refsFrom.add(localRef);
        break;
      default :
        throw new J.error("Jobj.addRef");
    }
  };

  J.prototype.addRefByName =
    function(type, nameInDb, nameLocalRef, nameForOtherRef){
    var self = this;
    nameLocalRef || (nameLocalRef = nameInDb);
    J.getByName(nameInDb, function(err, element){
        //TODO: handle the error
      var ref;
      ref.name = nameLocalRef;
      ref.id = element._id;
      ref.element = element;
      self._addref(ref, nameForOtherRef, type);
    });
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

      //TODO : verify that any modifying file inside the folder will not
      //TODO : restart the server (path must begin with a dot)
    }

    J._wipe();
    console.log("- end J.init()");
  };

  J.add = function(oneOreMoreElts, callback){
    var eltsDef = [];
    var callbackOnce;
    if (_.isArray(oneOreMoreElts)){
      eltsDef = oneOreMoreElts;
    }
    else{
      eltsDef[0] = oneOreMoreElts;
    }
    callbackOnce = _.after(eltsDef.length, callback);
    eltsDef.forEach(function (eltDef) {
      J._addOne(eltDef.obj, eltDef.type, eltDef.name, eltDef.start,
        callbackOnce);
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

  //TODO if necesary:
  J._addRef = function (element1, element2, relation){
    if((element1.objType !== "Jayuana") || (!element1.objType !=="Jayuana")){
      throw new J.Error("J._addRef", "at least one element is not a Jayuana " +
        "object");
    }
    if (relation === 'both'){

    }
    else if (relation === 'fromTo'){

    }
    else{
      throw new J.Error("J._addRef", "relation type wrong");
    }
  };

  J._wipe = function () {
    //remove all files within the folder:
    utils._emptyDirectory(process.env.PWD + "/" + J._folderName);

    //empty the db:
    J.db.remove({});

    //clean the activated elts:
    J._activated = [];
  };

  return J;
})();

