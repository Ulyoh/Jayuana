//var fs = Npm.require('fs');
//TODO: replace all *getBy* by *getBy*InDb
//TODO: create _jGetActiveBy, jGetActiveByDbName and jGetActiveByDbId
//TODO: create prototype.getId and .getName
//TODO: getName. getRefName in Reference

/*TODO: create test for:
*   J.
*   _jGetActiveBy
*   jGetActiveByDbId
*   jGetActiveByDbName
*
*   J.proto.
*   _jAddRef
*   jAddRef
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

      self.objType = "Jayuana";

      if (!element){
        throw J.Error("J.constructor", "no element passed");
      }

      utils.v("+ jStart create new instance of J, dbName :" + element.dbName);

      if (!element.refsFrom){
        element.refsFrom = null;
      }
      if (!element.refsTo){
        element.refsTo = null;
      }

      //J[element.dbId] = self;

      //TODO : add _activeId => do in ._add
      //TODO: reuse the _rStackTreatment of References

      self._element = element;
      self._dbId = element.dbId;
      self._dbName = element.dbName;
      self._jActiveId = -1;
      self._refsFrom = new J.References(element.refsFrom);
      self._refsTo = new J.References(element.refsTo);
      eval("element.obj =" + element.objToEval);  //jshint ignore: line
      self._obj = element.obj;

      J._jActivate(self);
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

  //todo: how to write properly ObjInfo Parameters in  JSDoc probably remove
  //todo:ObjInfo from constant.js and declare it in an other way

  //
  /**
   * Add references with an other object
   * @param {ObjInfo} otherJayuana
   * @param {string} otherJayuana.dbId optional if dbName exist
   * @param {string} [otherJayuana.dbname = null]
   * @param {bool} [otherJayuana.doNotActivate = false]
   * @param {Object} options
   * @param {RefType} options.refType
   * @param {string} [options.refName = options.otherObj._dbName]
   * @param {string} [options.refNameFromOtherObj = self._dbName]
   */
  J.prototype.jAddRef = function(otherJayuana, options){
    J._jAddingRef = true;
    utils.v("+ jStart jAddRef of ( " + this._dbName + " )");
    var dbId, refName, refInfo;
    var self = this;
    if (Match.test(otherJayuana.dbId, String)){
      dbId = otherJayuana.dbId;
      otherJayuana = J.jGetActiveByDbId(dbId);
      refName = options.refName || otherJayuana._dbName;
    }
    else if (Match.test(otherJayuana.dbName, String)){
      refName = options.otherObj.dbName;
      otherJayuana = J.jGetActiveByDbName(refName);
      dbId = otherJayuana.dbId;
    }
    else{
      throw new J.Error("J.jAddRef", "no valid Id neither name");
    }

    otherJayuana.doNotActivate =
        otherJayuana.doNotActivate || false;
    if (Match.test(otherJayuana.doNotActivate, Boolean)){
      throw new J.Error("J.jAddRef",
        "no valid otherJayuana.doNotActivate parameter");
    }

    if( otherJayuana.doNotActivate !== false){
      //must be find out by the activated index

      //TODO

    }

    //create the other object
    else{

    }

    refInfo = {
      dbId: dbId,
      rRefName: refName,
      activeElt: otherJayuana
    };

    self._jAddRef(refInfo, options.refType,
      options.refNameFromOtherObj || self._dbName);

    J._jAddingRef = false;
    utils.v("+ end jAddRef of ( " + this._dbName + " )");
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
  J.prototype.jAddRefTo = function (otherJayuana, options) {
    var self = this;
    options.refType = RefType.TO;
    self.jAddRef(otherJayuana, options);
  };

  J.prototype.jRun = function(){
    var self = this;
    utils.v("+ jStart J.prototype.jRun");
    self._obj();
    utils.v("- end J.prototype.jRun");
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
  J.prototype._jAddRef = function(refInfo, refType, refNameFromOtherObj){
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
        throw new J.error("Jobj.jAddRef");
    }
  };

  /**#@-*/

  // STATICS PROPERTIES:
  J._jActivated = [];
  J._jAddingRef = false; //TODO: removed if unused

  // STATICS METHODS:
  /**#@+
   * @public
   */

  J.jInit = function (options) {
    utils.v("+ jStart J.jInit()");
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

    J._jWipe();
    utils.v("- end J.jInit()");
  };

  J.jAddInDb = function(oneOreMoreElts, callback){
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
      J._jAddOne(eltDef.obj, eltDef.type, eltDef.dbName, eltDef.jStart,
        callbackOnce);
    });
  };

  J.jGetPassiveByDbId = function (dbId, callback) {
    J._jGetPassiveBy({_id: dbId }, callback);
  };

  J.jGetPassiveByDbName = function(dbName, callback) {
    J._jGetPassiveBy({dbName: dbName}, callback);
  };

  //TODO: should return an array:
  J.jGetActiveByDbId = function (dbId) {
    J._jGetActiveBy({dbId:dbId});
  };

  //TODO: should return an array:
  J.jGetActiveByDbName = function (dbName) {
    J._jGetActiveBy({_dbName:dbName});
  };

  J.jStart = function(){
    utils.v("+ jStart J.jStart()");
    J._jGetPassiveBy({jStart: true}, function (err, element) {
      if(err){
        throw err;
      }
      else{
        J._jStarter = new J(element);
        J._jStarter.jRun();
        utils.v("- end J.jStart()");
      }
    });
  };

  /**#@+
   * @private
   */
  J._jActivate = function (elt) {
    utils.evolvedPush(J._jActivated, elt, "_jActiveId");
  };

  J._jsAddRef = function (Jayuana1, Jayuana2, refType,
                        nameFrom1to2, nameFrom2to1) {
    var self = this;
    if(! Match.test(Jayuana1.objType,"Jayuana") ||
      ! Match.test(Jayuana2.objType,"Jayuana") ){
      throw new J.Error("J._jAddRef", "at least one element is not a Jayuana " +
        "object");
    }

    switch(refType){
      case 'both':
        self._refsFrom.add();
        self._refsTo.add();

        break;

      case 'from':

      case 'to':

        break;

      default:
        throw new J.Error("J._jAddRef", "relation type not valid");
    }
  };

  J._jAddOne = function(obj, type, dbName, start, callback){
    utils.v("+ jStart J._jAddOne( " + dbName + " )");
    var objUnderTest, element, dbId, data, filePath;

    dbName = dbName || '';
    start = start || false;
    element = {
      dbName: dbName,
      type: type,
      jStart: start,
      available: false,
      path: 'unknown'
    };
    utils.v("+ ++++1 J._jAddOne( " + dbName + " )");
    if((type !== "EJSON") && (type !== "code") && (type !== "file")){
      throw new J.Error("J.jAddInDb", "type not defined correctly");
    }

    utils.v("+ ++++2 J._jAddOne( " + dbName + " )");

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
          throw new J.Error("J.jAddInDb", "eval(): " + e.message);
        }
        data = obj;

        break;

      case "file":

        break;
    }

    utils.v("+ ++++3 J._jAddOne( " + dbName + " )");

    if (objUnderTest === undefined){
      throw new J.Error("J.jAddInDb", "undefined object");
    }

    if ((element.jStart === true) && !(_.isFunction(objUnderTest))){
      throw new J.Error("J.jAddInDb",
        "jStart flag true and object is not a function");
    }

    utils.v("+ ++++4 J._jAddOne( " + dbName + " )");

    dbId = J.db.insert(element);
    filePath = J._rootPath + J._folderName + dbId;

    utils.v("+ ready to writeFile of " + dbName);

    utils.fs.writeFile(filePath, data, Meteor.bindEnvironment(function (e) {
      utils.v("+ jStart writeFile of " + dbName);
      if (e) {
        J.db.remove(dbId);
        //TODO : should not throw an Error but pass the Error to callback(e, id)
        //TODO : save it in a log
        throw new J.Error("J.jAddInDb", "writeFile: " + e.message);
      }
      else{
        utils.v("- end J.jAddInDb( " + dbName + " )");
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

  J._jGetActiveBy = function(condition){
    utils.v("+ jStart J._jGetActiveBy( " + EJSON.stringify(condition) + " ), " +
      "J._jActivated.length: " + J._jActivated.length + "/n J._jActivated: " +
      EJSON.stringify(J._jActivated));
    var index = __.findIndex(J._jActivated, function (value) {
      var pattern = Match.ObjectIncluding(condition);
      Match.test(value, pattern);
    });
    if (index === -1){
      throw J.Error(  J._jGetActiveBy, "index not found, index: " + index);
    }
    utils.v("+ end J._jGetActiveBy( " +  EJSON.stringify(condition)  +
      " ), index: " + index);
    return J._jActivated[index];
  };

  J._jGetPassiveBy = function(condition, callback){
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

  J._jStarter = function(){};

  /**#@-*/

  //TODO if necesary:


  J._jWipe = function () {
    //remove all files within the folder:
    utils._emptyDirectory(process.env.PWD + "/" + J._folderName);

    //empty the db:
    J.db.remove({});

    //clean the activated elts:
    J._jActivated = [];
  };

  return J;
})();
