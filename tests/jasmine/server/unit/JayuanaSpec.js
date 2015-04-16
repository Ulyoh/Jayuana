/**
 * Created by yoh on 4/12/15.
 */

xdescribe("Jayuana", function () {
  Jayuana();
  xit("should create an empty db on the server");

  xdescribe(".add", function () {
    xit("should add new element(s) to the db");
    xit("should throw an error if the argument do not match");
    xit("should throw an error if the name already exists");
  });

  xdescribe(".getById", function () {
    xit("should access to an element by its id");
    xit("should throw an error if the id is not found");
    xit("should throw an error if the argument is not a string");
  });

  xdescribe(".getByName", function () {
    xit("should access to an element by its name");
    xit("should throw an error if the id is not found");
    xit("should throw an error if the argument is not a string");
  });

  xdescribe(".remove", function () {
    xit("should remove elements from the db by id or name");
    xit("should remove elements from the db by a list of ids or names");
    xit("should throw an error if an instance of the elements is used");
    xit("should throw an error if the element can be used by an other element");
    xit("should throw an error if the element can be used by an other element " +
    "witch is not removed at the same time");
    xit("should return the list of elements in RefsTo");
  });

  xdescribe(".start", function () {
    xit("should execute new Jayuana with the element which has the start flag");
  });
});

xdescribe("Jayuana object", function () {
  beforeEach(function () {
    Jobj = Jayuana.start();
  });

  xdescribe("private properties created", function () {
    it("should have a private id property");
    it("should have a private name property");
    it("should have a private refsFrom property");
    it("should have a private refsTo property");
    it("should have a private code property");
    it("should have a private data property");
    it("should have a private template property");
  });

  xdescribe("refsFrom and refsTo access", function () {
    it("should have at least one reference if it is not the start element");
  });

  xdescribe("id value handle between server and client");

  xdescribe("code", function () {
    it("should be executed when the object is created");
    it("should access to the refsFrom/To");
    it("should be able to modify the private data property");
    it("should be able to modify the template property");
    it("should stop execution if the object is removed");
  });

  xdescribe("create underneath Jayuana objects");

});

