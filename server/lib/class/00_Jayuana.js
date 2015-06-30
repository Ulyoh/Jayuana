//var fs = Npm.require('fs');
//TODO: replace all this by self in all files
//TODO: replace all *getBy* by *getBy*InDb
//TODO: create _getActiveBy, getActiveByName and getActiveById
//TODO: create prototype.getId and .getName

/*TODO: create test for:
*   J.
*   _getActiveBy
*   getActiveById
*   getActiveByName
*
*   J.proto.
*   _addRef
*   addRef
*   write doc for each method
*
* */

J = (function(){
  "use strict";
  /**
   *
   * @param element
   * @constructor
   */
  var J = function (element) {
    var self = this;
    if (self instanceof J){
      utils.v("+ start create new instance of J, name :" + element.name);

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
      utils.v("+ end create new instance of J, name :" + element.name);
    }
    else{
      throw new J.Error("J", "must be called with the 'new' keyword");
    }
  };

  /**#@+
   * @public
   */

  J.prototype = {};

  J.prototype.run = function(){
    var self = this;
    utils.v("+ start J.prototype.run");
    self._obj();
    utils.v("- end J.prototype.run");
  };

  /**
   * Add references with an other object
   * @param {Object} options
   * @param {RefType} options.refType
   * @param {ObjInfo} options.otherObj must contain idInDb or nameInDb property,
   * nameInDb is ignored if idInDb is found
   * @param {string} [options.nameRef = options.otherObj._name]
   * @param {string} [options.nameSelfForOtherRef = self._name]
   */
  J.prototype.addRef = function(options){
    utils.v("+ start addRef of ( " + this._name + " )");
    var id, name, otherJayuana, refInfo;
    var self = this;
    if (Match.test(options.otherObj.idInDb, String)){
      id = options.otherObj.idInDb;
      otherJayuana = J.getActiveById(id);
      name = options.nameRef || otherJayuana._name;
    }
    else if (Match.test(options.otherObj.nameInDb, String)){
      name = options.otherObj.nameInDb;
      otherJayuana = J.getActiveByName(name);
      id = otherJayuana._id;
    }
    else{
      throw new J.Error("J.addRef", "no valid Id neither name");
    }

    refInfo = {
      idInDb: id,
      localName: name,
      activeElt: otherJayuana
    };

    self._addRef(refInfo, options.refType,
      options.nameSelfForOtherRef || self._name);

    utils.v("+ end addRef of ( " + this._name + " )");
  };

  /**#@-*/
  /**#@+
   * @private
   */

  /**
   *
   * @param {RefInfo} refInfo of the other Jayuana object
   * @param {RefType} refType
   * @param {string} [nameSelfForOtherRef = refInfo.element._id]
   * @private
   */
  J.prototype._addRef = function(refInfo, refType, nameSelfForOtherRef){
    var self = this;
    var otherJayuana = refInfo.element;
    var refToSelf = {
      id: self._id,
      name: nameSelfForOtherRef || self._name,
      element: self._element
    };
    switch(refType){
      case 'to':
        self._refsTo.add(refInfo);
        otherJayuana._refsFrom.add(refToSelf);
        break;
      case 'from':
        otherJayuana._refsTo.add(refToSelf);
        self._refsFrom.add(refInfo);
        break;
      case 'both':
        self._refsTo.add(refInfo);
        self._refsFrom.add(refInfo);
        otherJayuana._refsTo.add(refToSelf);
        otherJayuana._refsFrom.add(refToSelf);
        break;
      default :
        throw new J.error("Jobj.addRef");
    }
  };


  /**#@-*/



  // STATICS PROPERTIES:
  J._activated = [];
  J._addingElt = false;

  // STATICS METHODS:
  J._addingEltEndDelayed = function(bool){
    var self = this;
    if (bool) {
      self.refDelay && (Meteor.setTimeout(self.refDelay,100));
      J._addingRef = true;
    }
    else{
      self.refDelay = Meteor.setTimeout(function () {
        J._addingRef = false;
      },100);
    }

  };

  J._starter = function(){};

  J.init = function (options) {
    utils.v("+ start J.init()");
    //var fs = Npm.require('fs');

    if (J.db === undefined) {
      J._rootPath = process.env.PWD + "/";

      if((options) && (options.folderName)){
        J._folderName = options.folderName + "/";
      }
      else{
        J._folderName = C.DEFAULT_FOLDER + "/";
      }

      try {
        utils.fs.mkdirSync(J._rootPath + J._folderName);
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
    utils.v("- end J.init()");
  };

  J.addInDb = function(oneOreMoreElts, callback){
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
    utils.v("+ start J._addOne( " + name + " )");
    var objUnderTest, element, id, data, filePath;

    name = name || '';
    start = start || false;
    element = {
      name: name,
      type: type,
      start: start,
      available: false,
      path: 'unknown'
    };
    utils.v("+ ++++1 J._addOne( " + name + " )");
    if((type !== "EJSON") && (type !== "code") && (type !== "file")){
      throw new J.Error("J.addInDb", "type not defined correctly");
    }

    utils.v("+ ++++2 J._addOne( " + name + " )");

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
          throw new J.Error("J.addInDb", "eval(): " + e.message);
        }
        data = obj;

        break;

      case "file":

        break;
    }

    utils.v("+ ++++3 J._addOne( " + name + " )");

    if (objUnderTest === undefined){
      throw new J.Error("J.addInDb", "undefined object");
    }

    if ((element.start === true) && !(_.isFunction(objUnderTest))){
      throw new J.Error("J.addInDb",
        "start flag true and object is not a function");
    }

    utils.v("+ ++++4 J._addOne( " + name + " )");

    id = J.db.insert(element);
    filePath = J._rootPath + J._folderName + id;

    utils.v("+ ready to writeFile of " + name);

    utils.fs.writeFile(filePath, data, Meteor.bindEnvironment(function (e) {
      utils.v("+ start writeFile of " + name);
      if (e) {
        J.db.remove(id);
        //TODO : should not throw an Error but pass the Error to callback(e, id)
        //TODO : save it in a log
        throw new J.Error("J.addInDb", "writeFile: " + e.message);
      }
      else{
        utils.v("- end J.addInDb( " + name + " )");
        J.db.update({_id: id},{$set: {
          available: true,
          path: filePath}});

        if (callback){
          callback(id);
        }
        utils.v("+ end writeFile of " + name);
      }

    }));
  };

  J._getBy = function(condition, callback){
    //var fs = Npm.require('fs');
    var element = J.db.findOne(condition);

    utils.fs.readFile(element.path, {encoding: 'utf8'}, function (err, data){
      if(!err){
        element.objToEval = data;
      }
      if (callback){
        callback(err, element);
      }
    });
  };

  J._getActiveBy = function(condition){
    utils.v("+ start J._getActiveBy( " + EJSON.stringify(condition) + " ), " +
      "J._activated.length: " + J._activated.length + "/n J._activated: " +
      EJSON.stringify(J._activated));
    var index = __.findIndex(J._activated, function (value) {
      var pattern = Match.ObjectIncluding(condition);
      Match.test(value, pattern);
    });
    if (index === -1){
      throw J.Error(  J._getActiveBy, "index not found, index: " + index);
    }
    utils.v("+ end J._getActiveBy( " +  EJSON.stringify(condition)  +
      " ), index: " + index);
    return J._activated[index];
  };

  J.getById = function (id, callback) {
    J._getBy({_id: id }, callback);
  };

  J.getByName = function(name, callback) {
    J._getBy({name: name}, callback);
  };

  J.getActiveById = function (id) {
    J._getActiveBy({id:id});
  };

  J.getActiveByName = function (name) {
    J._getActiveBy({_name:name});
  };

  J.start = function(){
    utils.v("+ start J.start()");
    J._getBy({start: true}, function (err, element) {
      if(err){
        throw err;
      }
      else{
        J._starter = new J(element);
        J._starter.run();
        utils.v("- end J.start()");
      }
    });
  };

  //TODO if necesary:
  J._addRef = function (element1, element2, relation){
    if((element1.objType !== "Jayuana") || ((!(element1.objType)) !=="Jayuana")){
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
