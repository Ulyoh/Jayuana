/**
 * Created by yoh on 4/12/15.
 */
//TODO: stringify
//TODO: check arguments type

"use strict";

describe("J", function () {
  var that = this;

  J.init();

  it("should create a db", function () {
    expect(J.db instanceof Mongo.Collection).toBeTruthy();
  });

  xit("it should throw an error if called with the 'new' keyword" );
  xit("it should throw an error if called twice" );
  xit("should create a folder on the server named 'jayuana_db_files'");

  describe("add", function () {

    xit("should throw an error if the type of element is not given");

    function testAdd(type, obj){
      if ((type !== "EJSON") && (type !== "code") && (type !== "file")){
        return;
      }
      return function (done) {
        J.add(obj, type, "", false, function (id) {
          that.pathFile = process.env.PWD + "/" + C.FILES_FOLDER + id;
          expect(J.db.findOne({_id: id }))
            .toEqual({
              _id: id,
              name: "",
              type: type,
              start: false,
              available: true,
              path: that.pathFile
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
          .toEqual(fs.readFileSync(that.pathFile, {encoding: "utf8"}));
      });

      xit("should verify that the new element(s) has(ve) been tested");
      xit("should throw an error if EJSON.parse give a different result");
      xit("should throw an error if the start flag is set to true");
      xit("should throw an error if the argument do not match");
      xit("should throw an error if the name already exists");
    });

    describe("using code", function () {
      var code = "function () {" +
        "'use strict';" +
        "return 'code executed';" +
        "};";
      it("should add a new element to the db as code", testAdd("code", code));

      it("should be able to set the start flag to true, and verify if the " +
      "code generate a function", function (done) {
        J.add(code, "code", '', true, function (id) {
          expect(J.db.findOne({_id: id}).start).toBeTruthy();
          done();
        });
        expect(function(){
          J.add("{info: 'this is not a function'}", "code", '', true);})
          .toThrowError("start flag true and object is not a function [J.add]");
      });

      xit("should verify that the new element(s) has(ve) been tested");
      xit("should throw an error if try to set the start flag to true for a " +
      "2nd element");
      xit("should throw an error if code do note return an object");
      xit("should throw an error if the argument do not match");
      xit("should throw an error if the name already exists");
      xit("should throw an error if the code add global variable");
      xit("should throw an error if the code use undeclared global variable");
    });

    xdescribe("using a file", function () {
    //TODO for client : use https://github.com/CollectionFS/Meteor-CollectionFS
      xit("should add a new element to the db from a file");
      xit("should be able to set the start flag to true and verify the object" +
      "is a function", function () {

      });
      xit("should throw an error if try to set the start flag to true for a " +
      "2nd element");
      xit("should throw an error if the argument do not match");
      xit("should throw an error if the name already exists");
      xit("should verify if file with same code already exists");
    });
  });

  xdescribe("getById", function () {
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

      J.add(obj, "EJSON", "", false, function (id) {
        J.getById(id, function (err, data) {
          expect(data).toEqual(jasmine.objectContaining(elementPartial));
          done();
        });
      });
    });

    xit("should throw an error if the id is not found");
    xit("should throw an error if the argument is not a string");
  });

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

      J.add(obj, "EJSON", name, false, function () {
        J.getByName(name, function (err, data) {
          expect(data).toEqual(jasmine.objectContaining(elementPartial));
          done();
        });
      });
    });
    xit("should throw an error if the id is not found");
    xit("should throw an error if the argument is not a string");
    xit("should throw an error if the string is empty");
  });

  xdescribe("remove", function () {
    it("should remove elements from the db by id or name");
    xit("should remove elements from the db by a list of ids or names");
    xit("should throw an error if an instance of the elements is used");
    xit("should throw an error if the element can be used by an other element");
    xit("should throw an error if the element can be used by an other element" +
    " witch is not removed at the same time");
    xit("should return the list of elements in RefsTo");
  });

  xdescribe("start", function () {
    it("should execute new J with the element which has " +
    "the start flag = true");
  });
});

xdescribe("J object", function () {
  beforeEach(function () {
    //var Jobj = J.start();
  });

  xdescribe("private properties created", function () {
    it("should have a private id property");
    it("should have a private name property");
    it("should have a private refsFrom property");
    it("should have a private refsTo property");
    it("should have a private object property");
    it("should have a private template property");
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

