var self;
//TODO: test addRef(options.otherObj.toActivate)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

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
      utils.v("+ Ref.constr.add throw Error no arg");
      self = this;
      expect(function () {
        new J.References();
      }).toThrow({
        Error: 'References constructor',
        reason: 'missing argument',
        details: 'stub stack'
      });
      utils.v("- Ref.constr.add throw Error no arg");
    });

    it("should create an empty Reference object if argument is null",
    function () {
      self = this;
      var refNull = new J.References(null);
      expect(refNull._list.length).toEqual(0);
    });

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

      it("should add a reference to the reference list", function (done) {
        utils.v("+ Ref.constr.add add ref to ref list");
        self = this;
        spyOn(Match, "test").and.callFake(function (value, pattern) {
          return pattern !== Array;
        });

        new J.References({refName: "refName", dbId: "dbId"},
          function () {
            self = this;
            expect(self._list[0]).toEqual(
              {refName: "refName", dbId: "dbId", refIndex: 0});
            utils.v("- Ref.constr.add add ref to ref list");
            done();
        });
      });

      it("should add an array of references to the reference list and" +
        " have only dbId and refName as properties",
        function (done) {
          utils.v("+ Ref.constr.add add ref array to ref list");
          self = this;
          spyOn(Match, "test").and.returnValue(true);

          var refsList = [
            {refName: "name1", dbId: "id1", somethingElse: "thing"},
            {refName: "name2", dbId: "id2"},
            {refName: "name3", dbId: "id3"}
          ];
          new J.References(refsList, function () {
            self = this;
            expect(self._list[0])
              .toEqual({dbId: "id1", refName: "name1", refIndex: 0});
            expect(self._list[1])
              .toEqual({dbId: "id2", refName: "name2", refIndex: 1});
            expect(self._list[2])
              .toEqual({dbId: "id3", refName: "name3", refIndex: 2});
            utils.v("- Ref.constr.add add ref array to ref list");
            done();
          });

        });

    });

  });

  describe("removeByDbId", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList, function () {
        done();
      });
    });

    it("should throw an Error if argument is not a string",
      function (done) {
        self = this;
        expect(function () {
          self.testRefs.removeByDbId({noId: "noId"});
        }).toThrow({
          Error: 'References',
          reason: "method removeByDbId: dbId argument is not a string",
          details: 'stub stack'
        });
        expect(self.testRefs._list[0])
          .toEqual({dbId: "id1", refName: "name1", refIndex: 0});
        expect(self.testRefs._list[1])
          .toEqual({dbId: "id2", refName: "name2", refIndex: 1});
        expect(self.testRefs._list[2])
          .toEqual({dbId: "id3", refName: "name3", refIndex: 2});
        done();
      });

    it("should throw an Error if dbId is not found",
      function (done) {
        self = this;
        spyOn(self.testRefs, "_getIndexByDbId").and.returnValue(-1);
        expect(function () {
          self.testRefs.removeByDbId("noId");
        }).toThrow({
          Error: 'References',
          reason: "method removeByDbId: dbId not found",
          details: 'stub stack'
        });
        expect(self.testRefs._list[0])
          .toEqual({dbId: "id1", refName: "name1", refIndex: 0});
        expect(self.testRefs._list[1])
          .toEqual({dbId: "id2", refName: "name2", refIndex: 1});
        expect(self.testRefs._list[2])
          .toEqual({dbId: "id3", refName: "name3", refIndex: 2});
        done();
      });

    it("should remove the reference corresponding to the given dbId",
      function (done) {
        self = this;
        spyOn(self.testRefs, "_getIndexByDbId").and.returnValue(1);
        self.testRefs.removeByDbId("id2");

        expect(self.testRefs._list[0])
          .toEqual({dbId: "id1", refName: "name1", refIndex: 0});
        expect(self.testRefs._list[1])
          .toBeUndefined();
        expect(self.testRefs._list[2])
          .toEqual({dbId: "id3", refName: "name3", refIndex: 2});
        done();
      });
  });

  describe("removeByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.obj;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList, function () {
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
        done();
      });

    });
    it("should throw an Error if argument is not a string",
      function (done) {
        //   spyOn(self.testRefs, "_getIndexByRefName").and.returnValue(-1);
        self = this;
        expect(function () {
          self.testRefs.removeByRefName({obj: "this is an obj"});
        }).toThrow({
          Error: 'References',
          reason: "method removeByRefName: argument is not a string",
          details: 'stub stack'
        });
        expect(self.testRefs._list[0])
          .toEqual({dbId: "id1", refName: "name1", refIndex: 0});
        expect(self.testRefs._list[1])
          .toEqual({dbId: "id2", refName: "name2", refIndex: 1});
        expect(self.testRefs._list[2])
          .toEqual({dbId: "id3", refName: "name3", refIndex: 2});
        done();
      });

    it("should throw an Error if the refName is not found", function (done) {
      self = this;
      expect(function () {
        self.testRefs.removeByRefName("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method removeByRefName: refName not found",
        details: 'stub stack'
      });
      expect(self.testRefs._list[0])
        .toEqual({dbId: "id1", refName: "name1", refIndex: 0});
      expect(self.testRefs._list[1])
        .toEqual({dbId: "id2", refName: "name2", refIndex: 1});
      expect(self.testRefs._list[2])
        .toEqual({dbId: "id3", refName: "name3", refIndex: 2});
      done();
    });

    it("should remove the reference", function (done) {
      self = this;
      self.testRefs.removeByRefName("name2");
      expect(self.testRefs._list[0])
        .toEqual({dbId: "id1", refName: "name1", refIndex: 0});
      expect(self.testRefs._list[1])
        .toBeUndefined();
      expect(self.testRefs._list[2])
        .toEqual({dbId: "id3", refName: "name3", refIndex: 2});
      done();
    });
  });

  describe("getDbIdByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noName;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList, function () {
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
        done();
      });
    });

    it("should throw an Error if argument is not a string",
      function (done) {
        self = this;
        expect(function () {
          self.testRefs.getDbIdByRefName({noName: "noName"});
        }).toThrow({
          Error: 'References',
          reason: "method getDbIdByRefName: argument is not a string",
          details: 'stub stack'
        });
        done();
      });

    it("should throw an Error if the dbId is not found", function (done) {
      self = this;
      expect(function () {
        self.testRefs.getDbIdByRefName("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method getDbIdByRefName: refName not found",
        details: 'stub stack'
      });
      done();
    });

    it("should return the dbId if the refName is found", function (done) {
      self = this;
      expect(self.testRefs.getDbIdByRefName("name1")).toEqual("id1");
      expect(self.testRefs.getDbIdByRefName("name2")).toEqual("id2");
      expect(self.testRefs.getDbIdByRefName("name3")).toEqual("id3");
      done();
    });
  });

  describe("getRefNameByDbId", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList, function () {
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
        done();
      });
    });

    it("should throw an Error if argument is not a string",
      function (done) {
        self = this;
        expect(function () {
          self.testRefs.getRefNameByDbId({noId: "noId"});
        }).toThrow({
          Error: 'References',
          reason: "method getRefNameByDbId: argument is not a string",
          details: 'stub stack'
        });
        done();
      });

    it("should throw an Error if the dbId is not found", function (done) {
      self = this;
      expect(function () {
        self.testRefs.getRefNameByDbId("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method getRefNameByDbId: dbId not found",
        details: 'stub stack'
      });
      done();
    });

    it("should return the dbId if the refName is found", function (done) {
      self = this;
      expect(self.testRefs.getRefNameByDbId("id1")).toEqual("name1");
      expect(self.testRefs.getRefNameByDbId("id2")).toEqual("name2");
      expect(self.testRefs.getRefNameByDbId("id3")).toEqual("name3");
      done();
    });
  });

  describe("isRefNameIn", function () {
    beforeEach(function (done) {
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
      done();
    });
    it("should return false if the refName is not found", function (done) {
      self = this;
      expect(self.testRefs.isRefNameIn("unknown")).toBeFalsy();
      done();
    });
    it("should return true if the refName is found", function (done) {
      self = this;
      expect(self.testRefs.isRefNameIn("name1")).toBeTruthy();
      expect(self.testRefs.isRefNameIn("name2")).toBeTruthy();
      expect(self.testRefs.isRefNameIn("name3")).toBeTruthy();
      done();
    });
  });

  describe("isDbIdIn", function () {
    beforeEach(function (done) {
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
      done();
    });
    it("should return false if dbId is not found", function (done) {
      self = this;
      expect(self.testRefs.isDbIdIn("unknown")).toBeFalsy();
      done();
    });
    it("should return true if dbId is found", function (done) {
      self = this;
      expect(self.testRefs.isDbIdIn("id1")).toBeTruthy();
      expect(self.testRefs.isDbIdIn("id2")).toBeTruthy();
      expect(self.testRefs.isDbIdIn("id3")).toBeTruthy();
      done();
    });
  });

  describe("_getIndexByDbId", function () {
    beforeEach(function (done) {
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
      self.testRefs = new J.References(refsList, function () {
        done();
      });
    });

    it("should return -1 if the given Id is not found", function (done) {
      self = this;
      expect(self.testRefs._getIndexByDbId("unknown")).toEqual(-1);
      done();
    });

    it("should return the corresponding index to the given Id",
      function (done) {
        self = this;
        expect(self.testRefs._getIndexByDbId("id1")).toEqual(0);
        expect(self.testRefs._getIndexByDbId("id2")).toEqual(1);
        expect(self.testRefs._getIndexByDbId("id3")).toEqual(2);
        done();
      });
  });

  describe("_getIndexByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {refName: "name1", dbId: "id1"},
        {refName: "name2", dbId: "id2"},
        {refName: "name3", dbId: "id3"}
      ];
      self.testRefs = new J.References(refsList, function () {
        done();
      });
    });
    it("should return the corresponding index to the given refName",
      function (done) {
        self = this;
        expect(self.testRefs._getIndexByRefName("unknown")).toEqual(-1);
        done();
      });
    it("should return -1 if the given refName is not found", function (done) {
      self = this;
      expect(self.testRefs._getIndexByRefName("name1")).toEqual(0);
      expect(self.testRefs._getIndexByRefName("name2")).toEqual(1);
      expect(self.testRefs._getIndexByRefName("name3")).toEqual(2);
      done();

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
