/**
 * Created by yoh on 4/12/15.
 */
//TODO: stringify
//TODO: check arguments type

"use strict";

var directoryName = ".packagesFilesTest";

var clean = function(){
  utils._emptyDirectory(process.env.PWD + "/" + directoryName);
};


describe("J", function () {
  var self = this;
  var options = {folderName: directoryName};

  beforeEach(function () {
    J.init(options);
  });

  it("should create a db", function () {
    expect(J.db instanceof Mongo.Collection).toBeTruthy();
  });

  it("should create a property _folderName", function () {
    expect(J._folderName).toEqual(directoryName + "/");
  });

  it("should create a folder with the named passed to J.init()", function () {

    var fs = Npm.require('fs');
    //fs.accessSync not working yet, use it when existsSync is removed
    //from fs API :
    //expect(fs.accessSync(process.env.PWD + "/" + directoryName)).not
    //.toThrow();
    expect(fs.existsSync(process.env.PWD + "/" + directoryName)).toBeTruthy();
  });

  clean();

  xit("it should create a _rootPath property");
  xit("it should create a folder with C.DEFAULT_FOLDER");
  xit("it should throw an Error if folder name do not begin with a dot");
  xit("it should throw an Error if called with the 'new' keyword" );
  xit("it should throw an Error if called twice" );
  xit("should create a folder on the server named 'jayuana_db_files'");

  describe("add", function () {

    xit("should throw an Error if the type of element is not given");

    function testAdd(type, obj){
      if ((type !== "EJSON") && (type !== "code") && (type !== "file")){
        return;
      }
      return function (done) {
        var eltDef = {
          obj: obj,
          type: type,
          name: "",
          start: false
      };
        J.add(eltDef, function (id) {
          self.pathFile = process.env.PWD + "/" + directoryName + "/" + id;
          expect(J.db.findOne({_id: id }))
            .toEqual({
              _id: id,
              name: "",
              type: type,
              start: false,
              available: true,
              path: self.pathFile
            });
          done();
        });
      };
    }

    describe("using EJSON", function () {
      var obj = {
        id: "an id",
        name: "a name",
        subobj: {
          something: "a thing",
          otherThing: "other"
        }
      };
      var fs = Npm.require('fs');

      it("should add an element in the db with related properties",
        testAdd("EJSON", obj)
        );
      
      it("should have the object saved in a file", function () {
        expect(EJSON.stringify(obj))
          .toEqual(fs.readFileSync(self.pathFile, {encoding: "utf8"}));
      });

      xit("should verify self the new element(s) has(ve) been tested");
      xit("should throw an Error if EJSON.parse give a different result");
      xit("should throw an Error if the start flag is set to true");
      xit("should throw an Error if the argument do not match");
      xit("should throw an Error if the name already exists");
    });

    xdescribe("using code", function () {
      var code = "function () {" +
        "'use strict';" +
        "return 'code executed';" +
        "};";
      it("should add a new element to the db as code", testAdd("code", code));

      it("should be able to set the start flag to true, and verify if the " +
      "code generate a function", function (done) {
        var eltDef = {
          obj: code,
          type: "code",
          name: "",
          start: false
        };
        J.add(eltDef, function (id) {
          expect(J.db.findOne({_id: id}).start).toBeTruthy();
          done();
        });
        expect(function(){

          var eltDef = {
            obj: "{info: 'this is not a function'}",
            type: "code",
            name: "",
            start: true
          };
          J.add(eltDef);})
          .toThrowError("start flag true and object is not a function [J.add]");
      });

      xit("should accept an array of elements");
      xit("should verify self the new element(s) has(ve) been tested");
      xit("should throw an Error if try to set the start flag to true for a " +
      "2nd element");
      xit("should throw an Error if code do note return an object");
      xit("should throw an Error if the argument do not match");
      xit("should throw an Error if the name already exists");
      xit("should throw an Error if the code add global variable");
      xit("should throw an Error if the code use undeclared global variable");
    });

    xdescribe("using a file", function () {
    //TODO for client : use https://github.com/CollectionFS/Meteor-CollectionFS
      xit("should add a new element to the db from a file");
      xit("should be able to set the start flag to true and verify the object" +
      "is a function", function () {

      });
      xit("should throw an Error if try to set the start flag to true for a " +
      "2nd element");
      xit("should throw an Error if the argument do not match");
      xit("should throw an Error if the name already exists");
      xit("should verify if file with same code already exists");
    });

    xdescribe("should call the callback only once");
  });

  clean();

  describe("getById", function () {
    it("should access to an element by its id", function (done) {
      var obj = "blabla"; //TODO: add test with different objects
                          //TODO: is a non object should be accepted?
      var elementPartial = {
        name: "",
        type: "EJSON",
        start: false,
        available: true,
        objToEval: EJSON.stringify(obj)
      };
      var eltDef = {
        obj: obj,
        type: "EJSON",
        name: "",
        start: false
      };

      J.add(eltDef, function (id) {
        J.getById(id, function (err, data) {
          self.data = data;
        });
      });
      Meteor.setTimeout(function () {
        expect(self.data).toEqual(jasmine.objectContaining(elementPartial));
        done();
      }, 50);
    });

    xit("should throw an Error if the id is not found");
    xit("should throw an Error if the argument is not a string");
  });

  clean();

  describe("getByName", function () {
    it("should access to an element by its name", function (done) {
      var obj = "blabla"; //TODO: add test with different objects
      //TODO: is a non object should be accepted?
      var name = "name_test";
      var elementPartial = {
        name: name,
        type: "EJSON",
        start: false,
        available: true,
        objToEval: EJSON.stringify(obj)
      };
      var eltDef = {
        obj: obj,
        type: "EJSON",
        name: name,
        start: false
      };


      J.add(eltDef, function () {
        J.getByName(name, function (err, data) {
          self.data = data;
        });
      });
      Meteor.setTimeout(function () {
        expect(self.data).toEqual(jasmine.objectContaining(elementPartial));
        done();
      }, 100);
    });
    xit("should throw an Error if the id is not found");
    xit("should throw an Error if the argument is not a string");
    xit("should throw an Error if the string is empty");
  });

  clean();

  xdescribe("remove", function () {
    it("should remove elements from the db by id or name");
    xit("should remove elements from the db by a list of ids or names");
    xit("should throw an Error if an instance of the elements is used");
    xit("should throw an Error if the element can be used by an other element");
    xit("should throw an Error if the element can be used by an other element" +
    " witch is not removed at the same time");
    xit("should return the list of elements in RefsTo");
  });

  describe("start", function () {
    it("should execute new J with the element which has " +
    "the start flag = true", function (done) {
      var eltDef = {
        obj: "function() {this.testMessage = 'coucou';}",
        type: "code",
        name: "coucou",
        start: true
      };
      J.add(eltDef, function () {
        J.start();
      });

      Meteor.setTimeout(function () {
        expect(J._starter.testMessage).toEqual('coucou');
        done();
      }, 200);

    });
    xit("J.starter should have a reference to its element root");
    xit("should throw an error if none element found with start flag = true");
    xit("should throw an error if more than one found");
  });

  clean();
});

describe("J object", function () {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
  var options = {folderName: directoryName};
  var eltsDefs = [];
  eltsDefs[0] = {
    obj:  "function() {this.testMessage = 'coucou';" +
          "  this.addRef({name: 'coucou 2'}, 'to');" +
          "}",
    type: "code",
    name: "coucou 1",
    start: true
  };
  eltsDefs[1] = {
    obj: "function() {this.testMessage = 'I have said coucou once';}",
    type: "code",
    name: "coucou 2",
    start: false
  };

  describe("private properties created", function () {
    var verifyPropertiesTypes = function(elt, property, type){
      expect(elt[property]).toEqual(jasmine.any(type));
    };
    var verifyPropertiesMyTypes = function(elt, property, type){
      console.log(elt);
      expect(elt[property].objType).toEqual(type);
    };

    console.log("beforeAll should start:");
    beforeAll(function (done) {
      console.log("beforeAll started");
      var self = this;
      self.JayuanaElts = [];
      J.init(options);
      console.log("******************* J._activated ***************");
      console.log(J._activated);

      console.log("******************* J._activated ***************");
      J.add(eltsDefs, function () {
        J.start();
        self.JayuanaElts = J._activated;
        console.log("****************start self.JayuanaElts ***************");
        console.log(self.JayuanaElts);

        console.log("****************end self.JayuanaElts ***************");

        console.log("beforeAll finshed");
        done();
      });
    });

    //TODO: test also with an object which is not J._starter
    it("should have a private id property", function (done) {
      var self = this;
      verifyPropertiesTypes(self.JayuanaElts[0], "_id", String);
      verifyPropertiesTypes(self.JayuanaElts[1], "_id", String);
      done();
    });
    it("should have a private name property", function (done) {
      var self = this;
      verifyPropertiesTypes(self.JayuanaElts[0], "_name", String);
      verifyPropertiesTypes(self.JayuanaElts[1], "_name", String);
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
    xdescribe("run", function () {
      xit("should execute the code in the code property ,with this = instance" +
      " object ");
    });
  });

  xdescribe("refsFrom and refsTo access", function () {
    xit("should have at least one reference if it is not the start element");
  });

  xdescribe("id value handle between server and client", function () {

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