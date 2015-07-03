var self;
describe("J.References", function () {
  beforeEach(function () {
    self = this;
    spyOn(J, "Error").and.callFake(function (a, b, c) {
      if (!c) {
        c = "stub stack";
      }
      var error = {};
      error.Error = a;
      error.reason = b;
      error.details = c;
      return error;
    });

  });

  describe("constructor", function () {

    it("should throw an Error if no argument passed", function () {
      self = this;
      expect(function () {
        new J.References();
      }).toThrow({
        Error: 'References constructor',
        reason: 'missing argument',
        details: 'stub stack'
      });
    });

    it("should create an empty Reference object if argument is null",
    function () {
      self = this;
      var refNull = new J.References(null);
      expect(refNull._list.length).toEqual(0);
    }

    )
    ;

    xit("should throw an Error if not called with the new keyword");

    describe("add", function () {
      it("should throw an Error if invalid argument passed", function () {
        self = this;
        spyOn(Match, "test").and.callFake(function (value) {
          return value !== "invalid";
        });

        expect(function () {
          new J.References("invalid");
        }).toThrow({
          Error: "References add",
          reason: "invalid or not object passed to add method",
          details: 'stub stack'
        });
      });

      it("should add a reference to the reference list", function () {
        self = this;
        spyOn(Match, "test").and.callFake(function (value, pattern) {
          return pattern !== Array;
        });

        var testRefs = new J.References({refName: "refName", dbId: "dbId"});
        expect(testRefs._list[0]).toEqual({refName: "refName", dbId: "dbId"});
      });

      it("should add an array of references to the reference list and" +
        " have only dbId and refName as properties",
        function () {
          self = this;
          spyOn(Match, "test").and.returnValue(true);

          var refsList = [
            {refName: "name1", dbId: "id1", somethingElse: "thing"},
            {refName: "name2", dbId: "id2"},
            {refName: "name3", dbId: "id3"}
          ];
          var testRefs = new J.References(refsList);

          expect(testRefs._list[0]).toEqual({dbId: "id1", refName: "name1"});
          expect(testRefs._list[1]).toEqual({dbId: "id2", refName: "name2"});
          expect(testRefs._list[2]).toEqual({dbId: "id3", refName: "name3"});
        });

    });

  });

  describe("removeByDbId", function () {
    beforeEach(function () {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList);
    });

    it("should throw an Error if argument is not a string",
      function () {
        self = this;
        expect(function () {
          self.testRefs.removeByDbId({noId: "noId"});
        }).toThrow({
          Error: 'References',
          reason: "method removeByDbId: dbId argument is not a string",
          details: 'stub stack'
        });
        expect(self.testRefs._list[0]).toEqual({dbId: "id1", refName: "name1"});
        expect(self.testRefs._list[1]).toEqual({dbId: "id2", refName: "name2"});
        expect(self.testRefs._list[2]).toEqual({dbId: "id3", refName: "name3"});
      });

    it("should throw an Error if dbId is not found",
      function () {
        self = this;
        spyOn(self.testRefs, "_getIndexByDbId").and.returnValue(-1);
        expect(function () {
          self.testRefs.removeByDbId("noId");
        }).toThrow({
          Error: 'References',
          reason: "method removeByDbId: dbId not found",
          details: 'stub stack'
        });
        expect(self.testRefs._list[0]).toEqual({dbId: "id1", refName: "name1"});
        expect(self.testRefs._list[1]).toEqual({dbId: "id2", refName: "name2"});
        expect(self.testRefs._list[2]).toEqual({dbId: "id3", refName: "name3"});
      });

    it("should remove the reference corresponding to the given dbId",
      function () {
        self = this;
        spyOn(self.testRefs, "_getIndexByDbId").and.returnValue(1);
        self.testRefs.removeByDbId("id2");

        expect(self.testRefs._list[0]).toEqual({dbId: "id1", refName: "name1"});
        expect(self.testRefs._list[1]).toBeUndefined();
        expect(self.testRefs._list[2]).toEqual({dbId: "id3", refName: "name3"});
      });
  });

  describe("removeByRefName", function () {
    beforeEach(function () {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noName;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList);
      spyOn(self.testRefs, "_getIndexByRefName").and
        .callFake(function (refName) {
        switch (refName) {
          case "name1":
            return 0;
          case "name2":
            return 1;
          case "name3":
            return 2;
          default:
            return -1;
        }
      });
    });
    it("should throw an Error if argument is not a string",
      function () {
        //   spyOn(self.testRefs, "_getIndexByRefName").and.returnValue(-1);
        self = this;
        expect(function () {
          self.testRefs.removeByRefName({obj: "this is an obj"});
        }).toThrow({
          Error: 'References',
          reason: "method removeByRefName: argument is not a string",
          details: 'stub stack'
        });
        expect(self.testRefs._list[0]).toEqual({dbId: "id1", refName: "name1"});
        expect(self.testRefs._list[1]).toEqual({dbId: "id2", refName: "name2"});
        expect(self.testRefs._list[2]).toEqual({dbId: "id3", refName: "name3"});
      });

    it("should throw an Error if the refName is not found", function () {
      self = this;
      expect(function () {
        self.testRefs.removeByRefName("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method removeByRefName: refName not found",
        details: 'stub stack'
      });
      expect(self.testRefs._list[0]).toEqual({dbId: "id1", refName: "name1"});
      expect(self.testRefs._list[1]).toEqual({dbId: "id2", refName: "name2"});
      expect(self.testRefs._list[2]).toEqual({dbId: "id3", refName: "name3"});
    });

    it("should remove the reference", function () {
      self = this;
      self.testRefs.removeByRefName("name2");
      expect(self.testRefs._list[0]).toEqual({dbId: "id1", refName: "name1"});
      expect(self.testRefs._list[1]).toBeUndefined();
      expect(self.testRefs._list[2]).toEqual({dbId: "id3", refName: "name3"});
    });
  });

  describe("getDbIdByRefName", function () {
    beforeEach(function () {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noName;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList);
      spyOn(self.testRefs, "_getIndexByRefName").and
        .callFake(function (refName) {
        switch (refName) {
          case "name1":
            return 0;
          case "name2":
            return 1;
          case "name3":
            return 2;
          default:
            return -1;
        }
      });
    });

    it("should throw an Error if argument is not a string",
      function () {
        self = this;
        expect(function () {
          self.testRefs.getDbIdByRefName({noName: "noName"});
        }).toThrow({
          Error: 'References',
          reason: "method getDbIdByRefName: argument is not a string",
          details: 'stub stack'
        });
      });

    it("should throw an Error if the dbId is not found", function () {
      self = this;
      expect(function () {
        self.testRefs.getDbIdByRefName("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method getDbIdByRefName: refName not found",
        details: 'stub stack'
      });
    });

    it("should return the dbId if the refName is found", function () {
      self = this;
      expect(self.testRefs.getDbIdByRefName("name1")).toEqual("id1");
      expect(self.testRefs.getDbIdByRefName("name2")).toEqual("id2");
      expect(self.testRefs.getDbIdByRefName("name3")).toEqual("id3");
    });
  });

  describe("getRefNameById", function () {
    beforeEach(function () {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList);
      spyOn(self.testRefs, "_getIndexByDbId").and.callFake(function (dbId) {
        switch (dbId) {
          case "id1":
            return 0;
          case "id2":
            return 1;
          case "id3":
            return 2;
          default:
            return -1;
        }
      });
    });

    it("should throw an Error if argument is not a string",
      function () {
        self = this;
        expect(function () {
          self.testRefs.getRefNameById({noId: "noId"});
        }).toThrow({
          Error: 'References',
          reason: "method getRefNameById: argument is not a string",
          details: 'stub stack'
        });
      });

    it("should throw an Error if the dbId is not found", function () {
      self = this;
      expect(function () {
        self.testRefs.getRefNameById("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method getRefNameById: dbId not found",
        details: 'stub stack'
      });
    });

    it("should return the dbId if the refName is found", function () {
      self = this;
      expect(self.testRefs.getRefNameById("id1")).toEqual("name1");
      expect(self.testRefs.getRefNameById("id2")).toEqual("name2");
      expect(self.testRefs.getRefNameById("id3")).toEqual("name3");
    });
  });

  describe("isRefNameIn", function () {
    beforeEach(function () {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList);
      spyOn(self.testRefs, "_getIndexByRefName")
        .and.callFake(function (refName) {
        switch (refName) {
          case "name1":
            return 0;
          case "name2":
            return 1;
          case "name3":
            return 2;
          default:
            return -1;
        }
      });
    });
    it("should return false if the refName is not found", function () {
      self = this;
      expect(self.testRefs.isRefNameIn("unknown")).toBeFalsy();
    });
    it("should return true if the refName is found", function () {
      self = this;
      expect(self.testRefs.isRefNameIn("name1")).toBeTruthy();
      expect(self.testRefs.isRefNameIn("name2")).toBeTruthy();
      expect(self.testRefs.isRefNameIn("name3")).toBeTruthy();
    });
  });

  describe("isIdIn", function () {
    beforeEach(function () {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList);
      spyOn(self.testRefs, "_getIndexByDbId").and.callFake(function (dbId) {
        switch (dbId) {
          case "id1":
            return 0;
          case "id2":
            return 1;
          case "id3":
            return 2;
          default:
            return -1;
        }
      });

    });
    it("should return false if dbId is not found", function () {
      self = this;
      expect(self.testRefs.isIdIn("unknown")).toBeFalsy();
    });
    it("should return true if dbId is found", function () {
      self = this;
      expect(self.testRefs.isIdIn("id1")).toBeTruthy();
      expect(self.testRefs.isIdIn("id2")).toBeTruthy();
      expect(self.testRefs.isIdIn("id3")).toBeTruthy();
    });
  });

  describe("_getIndexByDbId", function () {
    beforeEach(function () {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      spyOn(_, "indexOf").and.callThrough();
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList);
    });

    it("should return -1 if the given Id is not found", function () {
      self = this;
      expect(self.testRefs._getIndexByDbId("unknown")).toEqual(-1);
    });

    it("should return the corresponding index to the given Id",
      function () {
        self = this;
        expect(self.testRefs._getIndexByDbId("id1")).toEqual(0);
        expect(self.testRefs._getIndexByDbId("id2")).toEqual(1);
        expect(self.testRefs._getIndexByDbId("id3")).toEqual(2);
      });
  });

  describe("_getIndexByRefName", function () {
    beforeEach(function () {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList);
    });
    it("should return the corresponding index to the given refName",
      function () {
        self = this;
        expect(self.testRefs._getIndexByRefName("unknown")).toEqual(-1);
      });
    it("should return -1 if the given refName is not found", function () {
      self = this;
      expect(self.testRefs._getIndexByRefName("name1")).toEqual(0);
      expect(self.testRefs._getIndexByRefName("name2")).toEqual(1);
      expect(self.testRefs._getIndexByRefName("name3")).toEqual(2);

    });
  });

  xdescribe("patternOneRef", function () {
    self = this;
    spyOn(Match, "test").and.callThrough();
    it("should match an object with dbId and refName key", function () {

    });
    xit("should match an object with dbId and refName key and other(s) key(s)");
    xit("should not match an object without dbId key or without refName key");
  });

  xdescribe("patternArg", function(){});

});
