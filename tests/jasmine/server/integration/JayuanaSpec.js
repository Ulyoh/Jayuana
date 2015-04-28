/**
 * Created by yoh on 4/12/15.
 */
//TODO: stringify
//TODO: check arguments type
describe("Jayuana", function () {

  Jayuana(); //jshint ignore:line

  it("should create a db", function () {
    expect(Jayuana.db instanceof Mongo.Collection).toBeTruthy();
  });

  xit("it should throw an error if called with the 'new' keyword" );
  xit("it should throw an error if called twice" );
  xit("should create a folder on the server named 'jayuana_db_files'");

  describe("add", function () {

    xit("should throw an error if the type of element is not given");

    describe("using EJSON", function () {
      it("should add an object to the db as EJSON", function () {
        var obj = {
          id: "an id",
          name: "a name",
          subobj: {
            something: "a thing",
            otherThing: "other"
          }
        };
        var jasmineId;
        Jayuana.add(obj, "EJSON", "", false, function (id, done) {
          jasmineId = id;
          done();
        });


        expect(Jayuana.db.findOne({_id: jasmineId})).not.toBeUndefined();
      });

      xit("should verify that the new element(s) has(ve) been tested");
      xit("should throw an error if JSON.parse give a different result");
      xit("should throw an error if the start flag is set to true");
      xit("should throw an error if the argument do not match");
      xit("should throw an error if the name already exists");
    });

    xdescribe("using code", function () {
      var code = "function () {" +
        "'use strict';" +
        "return 'code executed';" +
        "};";
      it("should add a new element to the db as code", function () {
        Jayuana.add(code, "code");
        //expect(Jayuana.db.findOne({_id: id})).not.toBeUndefined();
      });

      it("should be able to set the start flag to true, and verify if the " +
      "code is or create a function", function () {
        var id = Jayuana.add(code, "code", '', true);
        expect(Jayuana.db.findOne({_id: id}).start).toBeTruthy();
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
      it("should add a new element to the db from a file");
      it("should be able to set the start flag to true, and verify the object" +
      "is a function", function () {

      });
      xit("should throw an error if try to set the start flag to true for a " +
      "2nd element");
      xit("should throw an error if the argument do not match");
      xit("should throw an error if the name already exists");
    });
  });

  xdescribe("getById", function () {
    it("should access to an element by its id");
    xit("should throw an error if the id is not found");
    xit("should throw an error if the argument is not a string");
  });

  xdescribe("getByName", function () {
    it("should access to an element by its name");
    xit("should throw an error if the id is not found");
    xit("should throw an error if the argument is not a string");
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
    it("should execute new Jayuana with the element which has " +
    "the start flag = true");
  });
});

xdescribe("Jayuana object", function () {
  beforeEach(function () {
    //var Jobj = Jayuana.start();
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

  xdescribe("create underneath Jayuana objects", function () {
    
  });

});

