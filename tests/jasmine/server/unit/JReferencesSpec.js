var self;
//TODO: test addRef(options.otherObj.toActivate)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

var Jtest1 = {fake: "Jayuana1", _jActiveId: 11};
var Jtest2 = {fake: "Jayuana2", _jActiveId: 12};
var Jtest3 = {fake: "Jayuana3", _jActiveId: 13};

//TODO: stub for J._jActivated[ref.activeId]
//TODO: stub for that :
/*      rRefName: ref.newRefName || elt.jGetActiveName(),
 _rActiveId: elt.jGetActiveId(),
 rActiveName: elt.jGetActiveName(),
 rDbId: elt.jGetDbId(),
 rDbName:  elt.jGetDbName(),
 rActiveElt: elt*/

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

  //TODO: describe _rCleanRef in integration

  describe("constructor", function () {

    it("should throw an Error if no argument passed", function () {
      utils.v("+ Ref.constr.rAdd throw Error no arg");
      self = this;
      expect(function () {
        new J.References();
      }).toThrow({
        Error: 'References constructor',
        reason: 'missing argument',
        details: 'stub stack'
      });
      utils.v("- Ref.constr.rAdd throw Error no arg");
    });

    it("should create an empty Reference object if argument is null",
    function () {
      utils.v("+ Ref.constr.rAdd create empty elt");
      self = this;
      var refNull = new J.References(null);
      expect(refNull._rList.length).toEqual(0);
      utils.v("- Ref.constr.rAdd create empty elt");
    });

    xit("should throw an Error if not called with the new keyword");

    describe("rAdd", function () {
      it("should throw an Error if invalid argument passed", function () {
        self = this;
        spyOn(Match, "test").and.callFake(function (value) {
          return value !== "invalid";
        });

        expect(function () {
          new J.References("invalid");
        }).toThrow({
          Error: 'References _rCleanRef',
          reason: 'invalid or not object passed to _rCleanRef method',
          details: 'stub stack'
        });
      });

      it("should add a reference to the reference list", function (done) {

        C.VERBOSE = true;

        utils.v("+ Ref.constr.rAdd add ref to ref list");
        self = this;
        spyOn(Match, "test").and.callFake(function (value, pattern) {
          return pattern !== Array;
        });
        
        new J.References({newRefName: "rRefName", activeId: 11},
          function () {
            self = this;
            expect(self._rList[0]).toEqual({
              rRefName: "rRefName",
              rActiveElt: Jtest1,
              _rRefId: 0,
              _rActiveId: 11});
            utils.v("- Ref.constr.rAdd add ref to ref list");
            done();
        });
      });

      it("should add an array of references to the reference list and" +
        " have only rRefName, activeElt, _rRefId and _rActiveId as properties",
        function (done) {
          utils.v("+ Ref.constr.rAdd add ref array to ref list");
          self = this;
          spyOn(Match, "test").and.returnValue(true);

          var refsList = [
            {newRefName: "name1", newActiveElt: Jtest1, somethingElse: "thing"},
            {newRefName: "name2", newActiveElt: Jtest2},
            {newRefName: "name3", newActiveElt: Jtest3}
          ];
          new J.References(refsList, function () {
            self = this;
            expect(self._rList[0]).toEqual({
              rActiveElt: Jtest1, 
              rRefName: "name1",
              _rRefId: 0, 
              _rActiveId: 11});
            expect(self._rList[1]).toEqual({
              rActiveElt: Jtest2, 
              rRefName: "name2",
              _rRefId: 1, 
              _rActiveId: 12});
            expect(self._rList[2]).toEqual({
              rActiveElt: Jtest3, 
              rRefName: "name3",
              _rRefId: 2, 
              _rActiveId: 13});
            utils.v("- Ref.constr.rAdd add ref array to ref list");
            done();
          });

        });

    });

  });

  C.VERBOSE = false;

  xdescribe("rRemoveByActiveId", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {newRefName: "name1", newActiveElt: Jtest1},
        {newRefName: "name2", newActiveElt: Jtest2},
        {newRefName: "name3", newActiveElt: Jtest3}
      ];
      self.testRefs = new J.References(refsList, function () {
        done();
      });
    });

    it("should throw an Error if argument is not a string",
      function (done) {
        self = this;
        expect(function () {
          self.testRefs.rRemoveByActiveId({noId: "noId"});
        }).toThrow({
          Error: 'References',
          reason: "method rRemoveByActiveId: activeId argument is not a string",
          details: 'stub stack'
        });
        expect(self.testRefs._rList[0]).toEqual(
          {rActiveElt: Jtest1, rRefName: "name1", _rRefId: 0, _rActiveId: 11});
        expect(self.testRefs._rList[1]).toEqual(
          {rActiveElt: Jtest2, rRefName: "name2", _rRefId: 1, _rActiveId: 12});
        expect(self.testRefs._rList[2]).toEqual(
          {rActiveElt: Jtest3, rRefName: "name3", _rRefId: 2, _rActiveId: 13});
        done();
      });

    it("should throw an Error if activeId is not found",
      function (done) {
        self = this;
        spyOn(self.testRefs, "_rGetIndexByActiveId").and.returnValue(-1);
        expect(function () {
          self.testRefs.rRemoveByActiveId("noId");
        }).toThrow({
          Error: 'References',
          reason: "method rRemoveByActiveId: activeId not found",
          details: 'stub stack'
        });
        expect(self.testRefs._rList[0]).toEqual(
          {rActiveElt: Jtest1, rRefName: "name1", _rRefId: 0, _rActiveId: 11});
        expect(self.testRefs._rList[1]).toEqual(
          {rActiveElt: Jtest2, rRefName: "name2", _rRefId: 1, _rActiveId: 12});
        expect(self.testRefs._rList[2]).toEqual(
          {rActiveElt: Jtest3, rRefName: "name3", _rRefId: 2, _rActiveId: 13});
        done();
      });

    it("should remove the reference corresponding to the given activeId",
      function (done) {
        self = this;
        spyOn(self.testRefs, "_rGetIndexByActiveId").and.returnValue(1);
        self.testRefs.rRemoveByActiveId(12);

        expect(self.testRefs._rList[0]).toEqual(
          {rActiveElt: Jtest1, rRefName: "name1", _rRefId: 0, _rActiveId: 11});
        expect(self.testRefs._rList[1]).toBeUndefined();
        expect(self.testRefs._rList[2]).toEqual(
          {rActiveElt: Jtest3, rRefName: "name3", _rRefId: 2, _rActiveId: 13});
        done();
      });
  });

  xdescribe("rRemoveByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.obj;
      });
      var refsList = [
        {newRefName: "name1", newActiveElt: Jtest1},
        {newRefName: "name2", newActiveElt: Jtest2},
        {newRefName: "name3", newActiveElt: Jtest3}
      ];
      self.testRefs = new J.References(refsList, function () {
        spyOn(self.testRefs, "_rGetIndexByRefName").and
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
        //   spyOn(self.testRefs, "_rGetIndexByRefName").and.returnValue(-1);
        self = this;
        expect(function () {
          self.testRefs.rRemoveByRefName({obj: "this is an obj"});
        }).toThrow({
          Error: 'References',
          reason: "method rRemoveByRefName: argument is not a string",
          details: 'stub stack'
        });
        expect(self.testRefs._rList[0]).toEqual(
          {rActiveElt: Jtest1, rRefName: "name1", _rRefId: 0, _rActiveId: 11});
        expect(self.testRefs._rList[1]).toEqual(
          {rActiveElt: Jtest2, rRefName: "name2", _rRefId: 1, _rActiveId: 12});
        expect(self.testRefs._rList[2]).toEqual(
          {rActiveElt: Jtest3, rRefName: "name3", _rRefId: 2, _rActiveId: 13});
        done();
      });

    it("should throw an Error if the refName is not found", function (done) {
      self = this;
      expect(function () {
        self.testRefs.rRemoveByRefName("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method rRemoveByRefName: refName not found",
        details: 'stub stack'
      });
      expect(self.testRefs._rList[0]).toEqual(
        {rActiveElt: Jtest1, rRefName: "name1", _rRefId: 0, _rActiveId: 11});
      expect(self.testRefs._rList[1]).toEqual(
        {rActiveElt: Jtest2, rRefName: "name2", _rRefId: 1, _rActiveId: 12});
      expect(self.testRefs._rList[2]).toEqual(
        {rActiveElt: Jtest3, rRefName: "name3", _rRefId: 2, _rActiveId: 13});
      done();
    });

    it("should remove the reference", function (done) {
      self = this;
      self.testRefs.rRemoveByRefName("name2");
      expect(self.testRefs._rList[0]).toEqual(
        {rActiveElt: Jtest1, rRefName: "name1", _rRefId: 0, _rActiveId: 11});
      expect(self.testRefs._rList[1]).toBeUndefined();
      expect(self.testRefs._rList[2]).toEqual(
        {rActiveElt: Jtest3, rRefName: "name3", _rRefId: 2, _rActiveId: 13});
      done();
    });
  });

  xdescribe("rGetActiveIdByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noName;
      });
      var refsList = [
        {newRefName: "name1", newActiveElt: Jtest1},
        {newRefName: "name2", newActiveElt: Jtest2},
        {newRefName: "name3", newActiveElt: Jtest3}
      ];
      self.testRefs = new J.References(refsList, function () {
        spyOn(self.testRefs, "_rGetIndexByRefName").and
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
          self.testRefs.rGetActiveIdByRefName({noName: "noName"});
        }).toThrow({
          Error: 'References',
          reason: "method rGetActiveIdByRefName: argument is not a string",
          details: 'stub stack'
        });
        done();
      });

    it("should throw an Error if the activeId is not found", function (done) {
      self = this;
      expect(function () {
        self.testRefs.rGetActiveIdByRefName("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method rGetActiveIdByRefName: refName not found",
        details: 'stub stack'
      });
      done();
    });

    it("should return the activeId if the refName is found", function (done) {
      self = this;
      expect(self.testRefs.rGetActiveIdByRefName("name1")).toEqual(11);
      expect(self.testRefs.rGetActiveIdByRefName("name2")).toEqual(12);
      expect(self.testRefs.rGetActiveIdByRefName("name3")).toEqual(13);
      done();
    });
  });

  xdescribe("rGetRefNameByActiveId", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {newRefName: "name1", newActiveElt: Jtest1},
        {newRefName: "name2", newActiveElt: Jtest2},
        {newRefName: "name3", newActiveElt: Jtest3}
      ];
      self.testRefs = new J.References(refsList, function () {
        spyOn(self.testRefs, "_rGetIndexByActiveId").
          and.callFake(function (activeId) {
          switch (activeId) {
            case 11:
              return 0;
            case 12:
              return 1;
            case 13:
              return 2;
            default:
              return -1;
          }
        });
        done();
      });
    });

    it("should throw an Error if argument is not a number",
      function (done) {
        self = this;
        expect(function () {
          self.testRefs.rGetRefNameByActiveId({noId: "noId"});
        }).toThrow({
          Error: 'References',
          reason: "method rGetRefNameByActiveId: argument is not a Number",
          details: 'stub stack'
        });
        done();
      });

    it("should throw an Error if the activeId is not found", function (done) {
      self = this;
      expect(function () {
        self.testRefs.rGetRefNameByActiveId("unknown");
      }).toThrow({
        Error: 'References',
        reason: "method rGetRefNameByActiveId: activeId not found",
        details: 'stub stack'
      });
      done();
    });

    it("should return the activeId if the refName is found", function (done) {
      self = this;
      expect(self.testRefs.rGetRefNameByActiveId(11)).toEqual("name1");
      expect(self.testRefs.rGetRefNameByActiveId(12)).toEqual("name2");
      expect(self.testRefs.rGetRefNameByActiveId(13)).toEqual("name3");
      done();
    });
  });

  xdescribe("rIsRefNameIn", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {newRefName: "name1", newActiveElt: Jtest1},
        {newRefName: "name2", newActiveElt: Jtest2},
        {newRefName: "name3", newActiveElt: Jtest3}
      ];
      self.testRefs = new J.References(refsList);
      spyOn(self.testRefs, "_rGetIndexByRefName")
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
      expect(self.testRefs.rIsRefNameIn("unknown")).toBeFalsy();
      done();
    });
    it("should return true if the refName is found", function (done) {
      self = this;
      expect(self.testRefs.rIsRefNameIn("name1")).toBeTruthy();
      expect(self.testRefs.rIsRefNameIn("name2")).toBeTruthy();
      expect(self.testRefs.rIsRefNameIn("name3")).toBeTruthy();
      done();
    });
  });

  xdescribe("rIsActiveIdIn", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {newRefName: "name1", newActiveElt: Jtest1},
        {newRefName: "name2", newActiveElt: Jtest2},
        {newRefName: "name3", newActiveElt: Jtest3}
      ];
      self.testRefs = new J.References(refsList);
      spyOn(self.testRefs, "_rGetIndexByActiveId")
        .and.callFake(function (activeId) {
        switch (activeId) {
          case 11:
            return 0;
          case 12:
            return 1;
          case 13:
            return 2;
          default:
            return -1;
        }
      });
      done();
    });
    it("should return false if activeId is not found", function (done) {
      self = this;
      expect(self.testRefs.rIsActiveIdIn("unknown")).toBeFalsy();
      done();
    });
    it("should return true if activeId is found", function (done) {
      self = this;
      expect(self.testRefs.rIsActiveIdIn(11)).toBeTruthy();
      expect(self.testRefs.rIsActiveIdIn(12)).toBeTruthy();
      expect(self.testRefs.rIsActiveIdIn(13)).toBeTruthy();
      done();
    });
  });

  xdescribe("_rGetIndexByActiveId", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      spyOn(_, "indexOf").and.callThrough();
      var refsList = [
        {newRefName: "name1", newActiveElt: Jtest1},
        {newRefName: "name2", newActiveElt: Jtest2},
        {newRefName: "name3", newActiveElt: Jtest3}
      ];
      self.testRefs = new J.References(refsList, function () {
        done();
      });
    });

    it("should return -1 if the given Id is not found", function (done) {
      self = this;
      expect(self.testRefs._rGetIndexByActiveId("unknown")).toEqual(-1);
      done();
    });

    it("should return the corresponding index to the given Id",
      function (done) {
        self = this;
        expect(self.testRefs._rGetIndexByActiveId(11)).toEqual(0);
        expect(self.testRefs._rGetIndexByActiveId(12)).toEqual(1);
        expect(self.testRefs._rGetIndexByActiveId(13)).toEqual(2);
        done();
      });
  });

  xdescribe("_rGetIndexByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      var refsList = [
        {newRefName: "name1", newActiveElt: Jtest1},
        {newRefName: "name2", newActiveElt: Jtest2},
        {newRefName: "name3", newActiveElt: Jtest3}
      ];
      self.testRefs = new J.References(refsList, function () {
        done();
      });
    });
    it("should return -1 if the given refName is not found",
      function (done) {
        self = this;
        expect(self.testRefs._rGetIndexByRefName("unknown")).toEqual(-1);
        done();
      });
    it("should return the corresponding index to the given refName",
      function (done) {
      self = this;
      expect(self.testRefs._rGetIndexByRefName("name1")).toEqual(0);
      expect(self.testRefs._rGetIndexByRefName("name2")).toEqual(1);
      expect(self.testRefs._rGetIndexByRefName("name3")).toEqual(2);
      done();

    });
  });

  xdescribe("rPatternOneRef", function () {
    self = this;
    spyOn(Match, "test").and.callThrough();
    it("should match an object with activeId and rRefName key", function () {

    });
    xit("should match an object with activeId, rRefName key and other(s) " +
      "key(s)");
    xit("should not match an object without activeId key or without " +
      "rRefName key");
  });

  xdescribe("rPatternArg", function(){});

});
