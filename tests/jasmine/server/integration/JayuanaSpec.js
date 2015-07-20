/**
 * Created by yoh on 4/12/15.
 */
//TODO: stringify
//TODO: check arguments type

"use strict";

var directoryName = ".packagesFilesTest";

describe("J", function () {
  var self = this;
  var options = {folderName: directoryName};

  beforeEach(function () {
    J.jInit(options);
  });

  it("should create a db", function () {
    expect(J.db instanceof Mongo.Collection).toBeTruthy();
  });

  it("should create a property _folderName", function () {
    expect(J._folderName).toEqual(directoryName + "/");
  });

  it("should create a folder with the named passed to J.jInit()", function () {

    //var fs = Npm.require('fs');
    //utils.fs.accessSync not working yet, use it when existsSync is removed
    //from fs API :
    //expect(utils.fs.accessSync(process.env.PWD + "/" + directoryName)).not
    //.toThrow();
    expect(utils.fs.existsSync(process.env.PWD + "/" + directoryName))
      .toBeTruthy();
  });

  xit("it should create a _rootPath property");
  xit("it should create a folder with C.DEFAULT_FOLDER");
  xit("it should throw an Error if folder name do not begin with a dot");
  xit("it should throw an Error if called with the 'new' keyword" );
  xit("it should throw an Error if called twice" );
  xit("should create a folder on the server named 'jayuana_db_files'");

  xdescribe("jInit", function () {
    xit("it should clean all trace of previous elts from the folder given," +
      "the db and J");
  });

  xdescribe("_jWipe");

  describe("add", function () {

    xit("should throw an Error if the type of element is not given");

    function setAdd(type, obj){
      if ((type !== "EJSON") && (type !== "code") && (type !== "file")){
        return;
      }
      return function (done) {
        var eltDef = {
          obj: obj,
          type: type,
          dbName: "",
          jStart: false
      };
        J.jAddInDb(eltDef, function (dbId) {
          self.pathFile = process.env.PWD + "/" + directoryName + "/" + dbId;
          self.dbId = dbId;
          done();
        });
      };
    }

    describe("using EJSON", function () {
      var type = "EJSON";
      var obj = {
        dbId: "an dbId",
        dbName: "a name",
        subobj: {
          something: "a thing",
          otherThing: "other"
        }
      };
      //var fs = Npm.require('fs');

      beforeEach(setAdd(type, obj));

      it("should add an element in the db with related properties",
        function (done) {

        expect(J.db.findOne({_id: self.dbId }))
          .toEqual({
            _id: self.dbId,
            dbName: "",
            type: type,
            jStart: false,
            available: true,
            path: self.pathFile
          });

        done();
      });


      
      it("should have the object saved in a file", function (done) {
        expect(EJSON.stringify(obj))
          .toEqual(utils.fs.readFileSync(self.pathFile, {encoding: "utf8"}));

        done();
      });

      xit("should verify self the new element(s) has(ve) been tested");
      xit("should throw an Error if EJSON.parse give a different result");
      xit("should throw an Error if the jStart flag is set to true");
      xit("should throw an Error if the argument do not match");
      xit("should throw an Error if the dbName already exists");
    });

    xdescribe("using code", function () {
      var code = "function () {" +
        "'use strict';" +
        "return 'code executed';" +
        "};";
      //it("should add a new element to the db as code", testAdd("code", code));

      it("should be able to set the jStart flag to true, and verify if the " +
      "code generate a function", function (done) {
        var eltDef = {
          obj: code,
          type: "code",
          dbName: "",
          jStart: false
        };
        J.jAddInDb(eltDef, function (dbId) {
          expect(J.db.findOne({_id: dbId}).jStart).toBeTruthy();
          done();
        });
        expect(function(){

          var eltDef = {
            obj: "{info: 'this is not a function'}",
            type: "code",
            dbName: "",
            jStart: true
          };
          J.jAddInDb(eltDef);})
          .toThrowError(
          "jStart flag true and object is not a function [J.jAddInDb]");
      });

      xit("should accept an array of elements");
      xit("should verify self the new element(s) has(ve) been tested");
      xit("should throw an Error if try to set the jStart flag to true for a " +
      "2nd element");
      xit("should throw an Error if code do note return an object");
      xit("should throw an Error if the argument do not match");
      xit("should throw an Error if the dbName already exists");
      xit("should throw an Error if the code add global variable");
      xit("should throw an Error if the code use undeclared global variable");
    });

    xdescribe("using a file", function () {
    //TODO for client : use https://github.com/CollectionFS/Meteor-CollectionFS
      xit("should add a new element to the db from a file");
      xit("should be able to set the jStart flag to true and verify the object" +
      "is a function", function () {

      });
      xit("should throw an Error if try to set the jStart flag to true for a " +
      "2nd element");
      xit("should throw an Error if the argument do not match");
      xit("should throw an Error if the dbName already exists");
      xit("should verify if file with same code already exists");
    });

    xdescribe("should call the callback only once");
  });

  

  describe("jGetPassiveByDbId", function () {
    it("should access to an element by its dbId", function (done) {
      var obj = "blabla"; //TODO: add test with different objects
                          //TODO: is a non object should be accepted?
      var elementPartial = {
        dbName: "",
        type: "EJSON",
        jStart: false,
        available: true,
        objToEval: EJSON.stringify(obj)
      };
      var eltDef = {
        obj: obj,
        type: "EJSON",
        dbName: "",
        jStart: false
      };

      J.jAddInDb(eltDef, function (dbId) {
        J.jGetPassiveByDbId(dbId, function (err, data) {
          self.data = data;
        });
      });
      Meteor.setTimeout(function () {
        expect(self.data).toEqual(jasmine.objectContaining(elementPartial));
        done();
      }, 50);
    });

    xit("should throw an Error if the dbId is not found");
    xit("should throw an Error if the argument is not a string");
  });

  describe("jGetPassiveByDbName", function () {
    it("should access to an element by its dbName", function (done) {
      var obj = "blabla"; //TODO: add test with different objects
      //TODO: is a non object should be accepted?
      var dbName = "name_test";
      var elementPartial = {
        dbName: dbName,
        type: "EJSON",
        jStart: false,
        available: true,
        objToEval: EJSON.stringify(obj)
      };
      var eltDef = {
        obj: obj,
        type: "EJSON",
        dbName: dbName,
        jStart: false
      };


      J.jAddInDb(eltDef, function () {
        J.jGetPassiveByDbName(dbName, function (err, data) {
          self.data = data;
        });
      });
      Meteor.setTimeout(function () {
        expect(self.data).toEqual(jasmine.objectContaining(elementPartial));
        done();
      }, 100);
    });
    xit("should throw an Error if the dbId is not found");
    xit("should throw an Error if the argument is not a string");
    xit("should throw an Error if the string is empty");
  });

  xdescribe("remove", function () {
    it("should remove elements from the db by dbId or dbName");
    xit("should remove elements from the db by a list of dbIds or dbNames");
    xit("should throw an Error if an instance of the elements is used");
    xit("should throw an Error if the element can be used by an other element");
    xit("should throw an Error if the element can be used by an other element" +
    " witch is not removed at the same time");
    xit("should return the list of elements in RefsTo");
  });

  describe("jStart", function () {
    it("should execute new J with the element which has " +
    "the jStart flag = true", function (done) {
      var eltDef = {
        obj: "function() {this.testMessage = 'coucou';}",
        type: "code",
        dbName: "coucou",
        jStart: true
      };
      J.jAddInDb(eltDef, function () {
        J.jStart();
      });

      Meteor.setTimeout(function () {
        expect(J._jStarter.testMessage).toEqual('coucou');
        done();
      }, 200);

    });
    xit("J.starter should have a reference to its element root");
    xit("should throw an error if none element found with jStart flag = true");
    xit("should throw an error if more than one found");
  });

  
});

xdescribe("J object", function () {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
  var options = {folderName: directoryName};
  var eltsDefs = [];

  eltsDefs[0] = {
    obj: "function() {console.log('hello Jayuana');}",
    type: "code",
    dbName: "coucou_child",
    jStart: false
  };
  eltsDefs[1] = {
    obj:  "function() {" +
          "   self = this;" +
          "   self.jAddRef({" +
          "     refType: RefType.TO," +
          "     otherObj: {dbName: 'coucou_child'}" +
          "     }," +
          "     function(){" +
          "       var dbIdToCall = self.getDbIdByDbName('coucou_child');" +
          "       J.jGetActiveByDbId(dbIdToCall)();" +
      //TODO: replace two previous lines by:
          "       self.jAddRef({dbName:'coucou_child'}).and.exec()" +
          "   })};",
    type: "code",
    dbName: "coucou 1",
    jStart: true
  };

  describe("private properties created", function () {
    var verifyPropertiesTypes = function(elt, property, type){
      utils.v("verifyPropertiesTypes of " + elt);
      expect(elt[property]).toEqual(jasmine.any(type));
    };
    var verifyPropertiesMyTypes = function(elt, property, type){
      utils.v("verifyPropertiesMyTypes of " + elt);
      expect(elt[property].objType).toEqual(type);
    };

    utils.v("beforeAll should jStart:");
    beforeAll(function (done) {
      utils.v("beforeAll started");
      var self = this;
      self.JayuanaElts = [];
      J.jInit(options);
      J.jAddInDb(eltsDefs, function () {
        J.jStart();
        self.JayuanaElts = J._jActivated;
        utils.v("****************jStart self.JayuanaElts ***************");
        utils.v(self.JayuanaElts);

        utils.v("****************end self.JayuanaElts ***************");

        utils.v("beforeAll finshed");
        done();
      });
    });

    //TODO: test also with an object which is not J._jStarter
    it("should have a private dbId property (dbId in the db)", function (done) {
      var self = this;
      verifyPropertiesTypes(self.JayuanaElts[0], "dbId", String);
      verifyPropertiesTypes(self.JayuanaElts[1], "dbId", String);
      done();
    });
    it("should have a private dbName property", function (done) {
      var self = this;
      verifyPropertiesTypes(self.JayuanaElts[0], "_dbName", String);
      verifyPropertiesTypes(self.JayuanaElts[1], "_dbName", String);
      done();
    });
    it("should have a private refsFrom property", function (done) {
      var self = this;
      verifyPropertiesMyTypes(self.JayuanaElts[0], "_refsFrom", "J.References");
      verifyPropertiesMyTypes(self.JayuanaElts[1], "_refsFrom", "J.References");
      done();
    });
    it("should have a private refsTo property", function (done) {
      var self = this;
      verifyPropertiesMyTypes(self.JayuanaElts[0], "_refsTo", "J.References");
      verifyPropertiesMyTypes(self.JayuanaElts[1], "_refsTo", "J.References");
      done();
    });
    it("should have a private object property which is a Function",
      function(done){
        var self = this;
        verifyPropertiesTypes(self.JayuanaElts[0], "_obj", Function);
        verifyPropertiesTypes(self.JayuanaElts[1], "_obj", Function);
        done();
      //TODO: test either a regular object or a Function
    });
    xit("should have a private template property");
    xit("should throw an error if the element do not have xxx property");
    xit("should throw an error if the element is not found in the database");

  });

  xdescribe("private method", function () {
    xdescribe("jRun", function () {
      xit("should execute the code in the code property ,with this = instance" +
      " object ");
    });
  });

  xdescribe("refsFrom and refsTo access", function () {
    xit("should have at least one reference if it is not the jStart element");
  });

  xdescribe("dbId value handle between server and client", function () {

  });

  xdescribe("code", function () {
    xit("should be executed when the object is created");
    xit("should access to the refsFrom/To");
    xit("should be able to modify the private data property");
    xit("should be able to modify the template property");
    xit("should stop execution if the object is removed");
  });

  xdescribe("toString", function () {
    xit("should show all private and public properties");
  });

  xdescribe("create underneath J objects", function () {
    
  });

});

Meteor.setTimeout(function () {
  utils._emptyDirectory(process.env.PWD + "/" + directoryName);
}, 5000);