//var fs = Npm.require('fs');
//TODO: replace all *getBy* by *getBy*InDb
//TODO: create _getActiveBy, getActiveByDbName and getActiveByDbId
//TODO: create prototype.getId and .getName
//TODO: getName. getRefName in Reference

/*TODO: create test for:
*   J.
*   _getActiveBy
*   getActiveByDbId
*   getActiveByDbName
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
      utils.v("+ start create new instance of J, dbName :" + element.dbName);

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

      //J[element.dbId] = self;

      self._element = element;
      self._dbId = element.dbId;
      self._dbName = element.dbName;
      self._refsFrom = new J.References(element.refsFrom);
      self._refsTo = new J.References(element.refsTo);
      eval("element.obj =" + element.objToEval);  //jshint ignore: line
      self._obj = element.obj;

      J._activated.push(self);
      utils.v("+ end create new instance of J, dbName :" + element.dbName);
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


  //todo: how to write properly ObjInfo Parameters in  JSDoc probably remove
  //todo:ObjInfo from constant.js and declare it in an other way

  //
  /**
   * Add references with an other object
   * @param {Object} options
   * @param {RefType} options.refType
   * @param {ObjInfo} options.otherJayuana
   * @param {string} options.otherJayuana.dbId optional if dbName exist
   * @param {string} [options.otherJayuana.dbname = null]
   * @param {bool} [options.otherJayuana.doNotActivate = false]
   * @param {string} [options.refName = options.otherObj._dbName]
   * @param {string} [options.refNameFromOtherObj = self._dbName]
   */
  J.prototype.addRef = function(otherJayuana, options){
    J._addingRef = true;
    utils.v("+ start addRef of ( " + this._dbName + " )");
    var dbId, refName, refInfo;
    var self = this;
    if (Match.test(options.otherJayuana.dbId, String)){
      dbId = options.otherJayuana.dbId;
      otherJayuana = J.getActiveByDbId(dbId);
      refName = options.refName || otherJayuana._dbName;
    }
    else if (Match.test(options.otherJayuana.dbName, String)){
      refName = options.otherObj.dbName;
      otherJayuana = J.getActiveByDbName(refName);
      dbId = otherJayuana.dbId;
    }
    else{
      throw new J.Error("J.addRef", "no valid Id neither name");
    }

      options.otherJayuana.doNotActivate =
        options.otherJayuana.doNotActivate || false;
    if (Match.test(options.otherJayuana.doNotActivate, Boolean)){
      throw new J.Error("J.addRef",
        "no valid options.otherJayuana.doNotActivate parameter");
    }

    if( options.otherJayuana.doNotActivate !== false){
      //must be find out by the activated index
    }

    //create the other object
    else{

    }

    refInfo = {
      dbId: dbId,
      refName: refName,
      activeElt: otherJayuana
    };

    self._addRef(refInfo, options.refType,
      options.refNameFromOtherObj || self._dbName);

    J._addingRef = false;
    utils.v("+ end addRef of ( " + this._dbName + " )");
  };

  /**
   * Add references with an other object
   * @param {ObjInfo} otherJayuana
   * @param {ObjInfo} otherJayuana.dbId optional if dbName exist
   * @param {ObjInfo} [otherJayuana.dbname = null]
   * @param {ObjInfo} otherJayuana.toActivate
   * @param {Object} options
   * @param {string} [options.refName = options.otherObj._dbName]
   * @param {string} [options.refNameFromOtherObj = self._dbName]
   */
  J.prototype.addRefTo = function (otherJayuana, options) {
    var self = this;
    options.refType = RefType.TO;
    self.addRef(otherJayuana, options);
  };
  /**#@-*/
  /**#@+
   * @private
   */

  /**
   *
   * @param {RefInfo} refInfo of the other Jayuana object
   * @param {RefType} refType
   * @param {string} [refNameFromOtherObj = refInfo.element.dbId]
   * @private
   */
  J.prototype._addRef = function(refInfo, refType, refNameFromOtherObj){
    var self = this;
    var otherJayuana = refInfo.element;
    var refToSelf = {
      dbId: self.dbId,
      refName: refNameFromOtherObj || self._dbName,
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
  J._addingRef = false;

  // STATICS METHODS:

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
      J._addOne(eltDef.obj, eltDef.type, eltDef.dbName, eltDef.start,
        callbackOnce);
    });
  };

  J._addOne = function(obj, type, dbName, start, callback){
    utils.v("+ start J._addOne( " + dbName + " )");
    var objUnderTest, element, dbId, data, filePath;

    dbName = dbName || '';
    start = start || false;
    element = {
      dbName: dbName,
      type: type,
      start: start,
      available: false,
      path: 'unknown'
    };
    utils.v("+ ++++1 J._addOne( " + dbName + " )");
    if((type !== "EJSON") && (type !== "code") && (type !== "file")){
      throw new J.Error("J.addInDb", "type not defined correctly");
    }

    utils.v("+ ++++2 J._addOne( " + dbName + " )");

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

    utils.v("+ ++++3 J._addOne( " + dbName + " )");

    if (objUnderTest === undefined){
      throw new J.Error("J.addInDb", "undefined object");
    }

    if ((element.start === true) && !(_.isFunction(objUnderTest))){
      throw new J.Error("J.addInDb",
        "start flag true and object is not a function");
    }

    utils.v("+ ++++4 J._addOne( " + dbName + " )");

    dbId = J.db.insert(element);
    filePath = J._rootPath + J._folderName + dbId;

    utils.v("+ ready to writeFile of " + dbName);

    utils.fs.writeFile(filePath, data, Meteor.bindEnvironment(function (e) {
      utils.v("+ start writeFile of " + dbName);
      if (e) {
        J.db.remove(dbId);
        //TODO : should not throw an Error but pass the Error to callback(e, id)
        //TODO : save it in a log
        throw new J.Error("J.addInDb", "writeFile: " + e.message);
      }
      else{
        utils.v("- end J.addInDb( " + dbName + " )");
        J.db.update({_id: dbId},{$set: {
          available: true,
          path: filePath}});

        if (callback){
          callback(dbId);
        }
        utils.v("+ end writeFile of " + dbName);
      }

    }));
  };

  J._getPassiveBy = function(condition, callback){
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

  J.getPassiveByDbId = function (dbId, callback) {
    J._getPassiveBy({_id: dbId }, callback);
  };

  J.getPassiveByDbName = function(dbName, callback) {
    J._getPassiveBy({dbName: dbName}, callback);
  };

  J.getActiveByDbId = function (dbId) {
    J._getActiveBy({dbId:dbId});
  };

  J.getActiveByDbName = function (dbName) {
    J._getActiveBy({_dbName:dbName});
  };

  J.start = function(){
    utils.v("+ start J.start()");
    J._getPassiveBy({start: true}, function (err, element) {
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
    if(! Match.test(element1.objType,"Jayuana") ||
      ! Match.test(element2.objType,"Jayuana") ){
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
