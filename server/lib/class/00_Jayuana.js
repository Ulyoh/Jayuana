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

//TODO: place utils.v(...) after arguments test

//TODO: replace all 'J' by Jayuana

J = (function () {
  "use strict";

  /**
   * @callback JCallback
   */

  /**
   * @param {Object} options  one of the three next possibilities is necessary
   * @param {string} [options.dbId]
   * @param {string} [options.dbName]
   * @param {boolean} [options.jStart]
   * @param {string} [options.activeName] //todo: create test for this option
   * @param {JCallback} [callback]
   * @constructor
   *
   */

  var J = function (options, callback) {
    utils.v("+ J with options: " + EJSON.stringify(options));
    var self = this;
    var cb;
    if (self instanceof J) {
      utils.v(" J called with 'new'");
      self.objType = "Jayuana";
      self._loaded = false;

      if (options.jStart && options.jStart === true){
        J._jGetPassiveBy({jStart: true}, function (err, element) {
          if (err) {
            throw err;
          }
          else {
            utils.v("   first element to run: " + EJSON.stringify(element));
            J._JCreateJayuanaObj.call(self, element, {
                activeName: options.activeName,
                callback: callback
              });
            J._jStarter = self;
            J._jStarter.jRun();
            utils.v("- end J.jStart()");
          }
        });
        return;
      }
      //else:
      cb = function (err, element) {
        if (err) {
          //TODO
        }
        else {
          J._JCreateJayuanaObj.call(self, element, {
            activeName: options.activeName,
            callback: callback
        });
        }
      };

      if (Match.test(options.dbId, String)) {
        J.jGetPassiveByDbId(options.dbId, cb);
      }
      else if (Match.test(options.dbName, String)) {
        J.jGetPassiveByDbName(options.dbName, cb);
      }

      else {
        utils.v("options: " + JSON.stringify(options));
        throw J.Error("J.constructor", "argument error");
      }

    }
    else {
      throw new J.Error("J", "must be called with the 'new' keyword");
    }
  };

  /**
   *@callback cbCreateJObj
   *
   * @param {JFromDb} element
   * @param {Object} [options]
   * @param {string} [options.activeName]
   * @param {cbCreateJObj} [options.callback]
   * @static
   * @private
   */
  J._JCreateJayuanaObj = function (element, options) {
    var self = this;
    var obj = {};
    var activeName, callback;

    if (options && options.callback){
      callback = options.callback;
    }
    if (!options || !options.activeName){
      activeName = element.dbName; //todo: verify if this activeName exists
    }
    if (self instanceof J) {

      self.objType = "Jayuana";

      if (!element) {
        throw J.Error("J.constructor", "no element passed");
      }

      utils.v("+ jStart create new instance of J, dbName :" + element.dbName);

      if (!element.JInitRefFrom) {
        element.JInitRefFrom = null;
      }
      if (!element.JInitRefTo) {
        element.JInitRefTo = null;
      }

      //J[element.dbId] = self;

      //TODO : add _activeId => do in ._add
      //TODO: reuse the _rStackTreatment of References

      self._jElement = element;
      self._jDbId = element.dbId;
      self._jDbName = element.dbName;
      self._jActiveId = -1;
      self._activeName = activeName;
      self._allRefsActivated = false;
      //todo: soit un activeName est donné soit l'element doit etre créé
      //todo: si l'elt doit être créé, un cb est utilisé pour le créé
      //todo: et seulement ensuite la Reference correspondante est créé
      //todo: si l'activeName n'existe pas, une liste d'attente de référence
      //todo: répertorie les activeName attendu. A chaque nouvelle création
      //todo: d'un Jayuana, la liste d'attente est consulté.
      //todo: un défaut apparait si la liste d'attente n'est pas vide alors
      //todo: que aucun nouveau Jayuana est en cours de création.

      self._jRefsFrom = new J.References(element.JInitRefFrom);
      //todo pour chaque reference, il faut créer un jayuana
      self._jRefsTo = new J.References(element.JInitRefTo);
      eval("obj =" + element.objToEval);  //jshint ignore: line
      self._jObj = obj;


      J._jStackJayuanasToAdd.push({
        valueToAdd: self,
        callback: callback
      });
      J._jActivate(self);
      utils.v("+ end create new instance of J, dbName :" + element.dbName);
    }
    else {
      throw new J.Error("J", "must be called with the 'new' keyword");
    }
  };
  /**#@+
   * @public
   */

  J.prototype = {};

  //todo: how to write properly ObjInfo Parameters in  JSDoc probably remove
  //todo:ObjInfo from constant.js and declare it in an other way
  /*
   J.prototype.ActivateOtherAndAddRef(otherJayuanaDbNameOrId, refType, options){

   };*/

  /**
   * @param {RefType} refType
   * @param {J|string} otherJayuana
   * @param {Object} [options]
   * @param {string} [options.nameFromThisToOther = this.jGetActiveName()]
   * @param {string} [options.nameFromOtherToThis =
   *                  otherJayuana.jGetActiveName()]
   * @private
   */
  J.prototype.jAddRef = function (refType, otherJayuana, options) {
    var self = this;

    if (Match.test(otherJayuana, String)) {
      otherJayuana = J.jGetActiveByActiveName(otherJayuana);
    }

    J._jAddRefBetween(self, otherJayuana, refType,
      options.nameFromThisToOther, options.nameFromOtherToThis);
  };

  //TODO: create test for this method:
  J.prototype.jIsItActive = function () {
    var self = this;
    return J._rList[self._jActiveId] === self;
  };

  //TODO: create test for this method:
  J.prototype.jGetActiveName = function () {
    return this._jActiveName;
  };

  //TODO: create test for this method:
  J.prototype.jGetActiveId = function () {
    return this._jActiveId;
  };

  //TODO: create test for this method:
  J.prototype.jGetDbName = function () {
    return this._jDbName;
  };

  //TODO: create test for this method:
  J.prototype.jGetDbId = function () {
    return this._jDbId;
  };

  J.prototype.jRun = function () {
    var self = this;
    utils.v("+ jStart J.prototype.jRun");
    self._jObj();
    utils.v("- end J.prototype.jRun");
  };

  /**#@-*/
  /**#@+
   * @private
   */


  /**#@-*/

    // STATICS PROPERTIES:
  J._jStackJayuanasToAdd = [];
  J._jActivated = [];
  J._jNextJActiveId = 0;
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

      if ((options) && (options.folderName)) {
        J._folderName = options.folderName + "/";
      }
      else {
        J._folderName = C.DEFAULT_FOLDER + "/";
      }

      try {
        utils.fs.mkdirSync(J._rootPath + J._folderName);
      }
      catch (e) {
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

  /**
   * used to add a new element in the db
   * @typedef {Object} elementDefinition
   * @property {Object} obj
   * @property {RefType} type
   * @property {string} dbName
   * @property {boolean} start
   */

  /**
   *
   * @param oneOreMoreElements {Array.<elementDefinition>|elementDefinition}
   * @param callback {Function}
   */
  J.jAddInDb = function (oneOreMoreElements, callback) {
    var eltsDef = [];
    var callbackOnce;
    if (_.isArray(oneOreMoreElements)) {
      eltsDef = oneOreMoreElements;
    }
    else {
      eltsDef[0] = oneOreMoreElements;
    }
    callbackOnce = _.after(eltsDef.length, callback);
    eltsDef.forEach(function (eltDef) {
      J._jAddOne(eltDef, callbackOnce);
    });
  };

  //TODO: should return an array
  J.jGetPassiveByDbId = function (dbId, callback) {
    J._jGetPassiveBy({_id: dbId}, callback);
  };

  //TODO: should return an array
  J.jGetPassiveByDbName = function (dbName, callback) {
    utils.v("+ J.jGetPassiveByDbName()");
    J._jGetPassiveBy({dbName: dbName}, callback);
  };

  //TODO: create test for this method:
  J.jGetActiveByActiveName = function (activeName, returnNullifNotFound) {
    return J._jGetActiveBy({_jActiveName: activeName}, returnNullifNotFound);
  };

  //TODO: create test for this method:
  J.jGetActiveByActiveId = function (activeId, returnNullifNotFound) {
    if (!J._jActivated[activeId]) {
      if (returnNullifNotFound){
        return null;
      }
      throw new J.Error("J.jGetActiveByActiveId",
        "not active Jayuana with this activeId");
    }
    return J._jActivated[activeId];
  };

  //TODO: create test for this method:
  //TODO: should return an array:
  J.jGetActiveByDbId = function (dbId, returnNullifNotFound) {
    J._jGetActiveBy({_jdbId: dbId}, returnNullifNotFound);
  };

  //TODO: create test for this method:
  //TODO: should return an array:
  J.jGetActiveByDbName = function (dbName, returnNullifNotFound) {
    J._jGetActiveBy({_jDbName: dbName}, returnNullifNotFound);
  };

  J.jStart = function () {
    utils.v("+ jStart J.jStart()");
    new J({jStart: true});

  };

  /**#@+
   * @private
   */

  J._jActivate = __.debounce(function () {
    debugger;
    utils.addStackToArray(J, J._jActivated, J._jStackJayuanasToAdd,
      "_jActiveId",
      function () {
        return J._jNextJActiveId++;
      },
      function (newValue) {
        debugger;
        if (J.jGetActiveByActiveName(newValue.activeName, true)){
          throw new J.Error("J._jActivate", "activeName already exists");
        }
      }
    );
  });

  //TODO: write test for this method
  J._jAddRefBetween = function (
    jayuana1, jayuana2, refType1to2, nameFrom1to2, nameFrom2to1) {
    utils.v("+ jStart _jAddRefBetween ( " +
      jayuana1._jActiveName, jayuana2._jActiveName + " )");

    var newRef1, newRef2;

    if (!Match.test(jayuana1.objType, "Jayuana") ||
      !Match.test(jayuana2.objType, "Jayuana")) {
      throw new J.Error("J._jAddRefBetween",
        "at least one element is not a Jayuana object");
    }
    if (!jayuana1.jIsItActive()) {
      throw new J.Error("J._jAddRefBetween", "Jayuana1 is not active");
    }
    if (!jayuana2.jIsItActive()) {
      throw new J.Error("J._jAddRefBetween", "Jayuana2 is not active");
    }

    //init optional parameters:
    nameFrom1to2 = nameFrom1to2 || jayuana2.jGetActiveName();
    nameFrom2to1 = nameFrom2to1 || jayuana1.jGetActiveName();

    if (!Match.test(nameFrom1to2, String)) {
      throw new J.Error("J._jAddRefBetween",
        "Jayuana1 name to Jayuana2 is not a string");
    }

    if (!Match.test(nameFrom2to1, String)) {
      throw new J.Error("J._jAddRefBetween",
        "Jayuana2 name to Jayuana1 is not a string");
    }

    newRef1 = {
      newRefName: nameFrom1to2,
      newActiveElt: jayuana2
    };

    newRef2 = {
      newRefName: nameFrom2to1,
      newActiveElt: jayuana1
    };

    switch (refType1to2) {
      case 'to':
        jayuana1._jRefsTo.rAdd(newRef1);
        jayuana2._jRefsFrom.rAdd(newRef2);
        break;
      case 'from':
        jayuana2._jRefsTo.rAdd(newRef2);
        jayuana1._jRefsFrom.rAdd(newRef1);
        break;
      case 'both':
        jayuana1._jRefsTo.rAdd(newRef1);
        jayuana1._jRefsFrom.rAdd(newRef1);
        jayuana2._jRefsTo.rAdd(newRef2);
        jayuana2._jRefsFrom.rAdd(newRef2);
        break;
      default :
        throw new J.Error("Jobj._jAddRefBetween");
    }

    utils.v("+ end _jAddRefBetween ( " +
      jayuana1._jActiveName, jayuana2._jActiveName + " )");
  };

  /**
   *
   * @param elementDef {elementDefinition}
   * @param callback {function}
   * @private
   */
  J._jAddOne = function (elementDef, callback) {
    var objUnderTest, element, dbId, data, filePath;
    var obj = elementDef.obj, type = elementDef.type;
    var dbName = elementDef.dbName, jStart = elementDef.jStart;
    utils.v("+ jStart J._jAddOne( " + dbName + " )");

    function writeFileAndSetDb() {
      utils.v("+ writeFileAndSetDb " + dbName);
      if (objUnderTest === undefined) {
        throw new J.Error("J.jAddInDb", "undefined object");
      }

      if ((element.jStart === true) && !(_.isFunction(objUnderTest))) {
        throw new J.Error("J.jAddInDb",
          "jStart flag true and object is not a function");
      }

      dbId = J.db.insert(element);
      filePath = J._rootPath + J._folderName + dbId;
      utils.fs.writeFile(filePath, data, Meteor.bindEnvironment(function (e) {
        utils.v("+ jStart writeFile of " + dbName);
        if (e) {
          J.db.remove(dbId);
          //TODO : should not throw an Error but pass the Error to
          // callback(e, id)
          //TODO : save it in a log
          throw new J.Error("J.jAddInDb", "writeFile: " + e.message);
        }
        else {
          utils.v("- end J.jAddInDb( " + dbName + " )");
          J.db.update({_id: dbId}, {
            $set: {
              available: true,
              path: filePath
            }
          });

          if (callback) {
            callback(dbId);
          }

        }
        utils.v("- writeFileAndSetDb " + dbName);
      }));
    }

    dbName = dbName || '';
    jStart = jStart || false;
    element = {
      dbName: dbName,
      type: type,
      jStart: jStart,
      available: false,
      path: 'unknown'
    };

    if ((type !== "EJSON") && (type !== "code") && (type !== "file")) {
      throw new J.Error("J.jAddInDb", "type not defined correctly");
    }

    switch (type) {
      case "EJSON":
        objUnderTest = obj;
        data = EJSON.stringify(obj);
        break;

      case "code":
        try {
          eval('objUnderTest = ' + obj); //jshint ignore:line
        }
        catch (e) {
          throw new J.Error("J.jAddInDb", "eval(): " + e.message);
        }
        data = obj;

        break;

      case "file":

        break;
    }

    if (type !== "file") {
      writeFileAndSetDb();
    }

    utils.v("- jStart J._jAddOne( " + dbName + " )");
  };

  //TODO: write test for this method (must work with holes in the array)
  J._jGetActiveBy = function (condition, returnNullifNotFound) {
    utils.v("+ jStart J._jGetActiveBy( " + EJSON.stringify(condition) + " ), " +
      "J._jActivated.length: " + J._jActivated.length + "/n J._jActivated: " +
      EJSON.stringify(J._jActivated));

    var index = -1;
    var cp = Object.getOwnPropertyNames(condition); //cp: conditionsProperties
    var activeJ;

    for(var i = J._jActivated.length - 1; i >= 0 ; i--){
      activeJ = J._jActivated[i];
      for(var j = cp.length - 1; j >= 0 ; j--){
        if(activeJ[cp[j]] !== condition[cp[j]]) {
          break;
        }
        if(j === 0){
          index = i;
        }
      }
      if(index !== -1){
        break;
      }
    }

    if (index === -1) {
      if (returnNullifNotFound){
        return null;
      }
      throw new J.Error("J._jGetActiveBy", "index not found, index: " + index);
    }

    utils.v("+ end J._jGetActiveBy( " + EJSON.stringify(condition) +
      " ), index: " + index);
    return J._jActivated[index];
  };

  J._jGetPassiveBy = function (condition, callback) {
    utils.v(" + J._jGetPassiveBy with condition: ", EJSON.stringify(condition));
    //var fs = Npm.require('fs');
    var element = J.db.findOne(condition);//TODO: make it asynchrone

    utils.fs.readFile(element.path, {encoding: 'utf8'},
      function (err, data) {
        if (!err) {
          element.objToEval = data;
        }
        if (callback) {
          callback(err, element);
          utils.v(" - J._jGetPassiveBy");
        }
      });
  };

  J._jStarter = function () {
  };

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
