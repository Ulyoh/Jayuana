var self;
//TODO: test addRef(options.otherObj.toActivate)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

//create fakes Jayuana elts:
var fakeJayuana = {
  jGetActiveId: function () {
    return this._jActiveId;
  },
  jGetActiveName: function () {
    return this._jActiveName;
  },
  jGetDbId: function () {
    return this._jDbId;
  },
  jGetDbName: function () {
    return this._jDbName;
  }
};

var Jtest0 = {
  _jActiveId: 10,
  _jActiveName: "j0",
  _jDbId: 0,
  _jDbName: "db0"
};
var Jtest1 = {
  _jActiveId: 11,
  _jActiveName: "j1",
  _jDbId: 1,
  _jDbName: "db1"
};
var Jtest2 = {
  _jActiveId: 12,
  _jActiveName: "j2",
  _jDbId: 2,
  _jDbName: "db2"
};
var Jtest3 = {
  _jActiveId: 13,
  _jActiveName: "j3",
  _jDbId: 3,
  _jDbName: "db3"
};
__.extend(Jtest0,fakeJayuana);
__.extend(Jtest1,fakeJayuana);
__.extend(Jtest2,fakeJayuana);
__.extend(Jtest3,fakeJayuana);

J._jActivated[10]=Jtest0;
J._jActivated[11]=Jtest1;
J._jActivated[12]=Jtest2;
J._jActivated[13]=Jtest3;

var ref1result = {
  rRefName: "name1",
  _rActiveId: 11,
  rActiveName: 'j1',
  rDbId: 1,
  rDbName: 'db1',
  rActiveElt: Jtest1,
  _rRefId: 0};
var ref2result = {
  rRefName: "name2",
  _rActiveId: 12,
  rActiveName: 'j2',
  rDbId: 2,
  rDbName: 'db2',
  rActiveElt: Jtest2,
  _rRefId: 1};
var ref3result = {
  rRefName: "name3",
  _rActiveId: 13,
  rActiveName: 'j3',
  rDbId: 3,
  rDbName: 'db3',
  rActiveElt: Jtest3,
  _rRefId: 2};

var refsList = [
  {newRefName: "name1", activeId: 11, somethingElse: "thing"},
  {newRefName: "name2", activeId: 12},
  {newRefName: "name3", activeName: "j3"}
];
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
              _rActiveId: 11,
              rActiveName: 'j1',
              rDbId: 1,
              rDbName: 'db1',
              rActiveElt: Jtest1,
              _rRefId: 0});
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

          new J.References(refsList, function () {
            self = this;
            expect(self._rList[0]).toEqual({
              rRefName: "name1",
              _rActiveId: 11,
              rActiveName: 'j1',
              rDbId: 1,
              rDbName: 'db1',
              rActiveElt: Jtest1,
              _rRefId: 0});
            expect(self._rList[1]).toEqual({
              rRefName: "name2",
              _rActiveId: 12,
              rActiveName: 'j2',
              rDbId: 2,
              rDbName: 'db2',
              rActiveElt: Jtest2,
              _rRefId: 1});
            expect(self._rList[2]).toEqual({
              rRefName: "name3",
              _rActiveId: 13,
              rActiveName: 'j3',
              rDbId: 3,
              rDbName: 'db3',
              rActiveElt: Jtest3,
              _rRefId: 2});
            utils.v("- Ref.constr.rAdd add ref array to ref list");
            done();
          });

        });

    });

  });

  describe("rRemoveByActiveId", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
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
        expect(self.testRefs._rList[0]).toEqual(ref1result);
        expect(self.testRefs._rList[1]).toEqual(ref2result);
        expect(self.testRefs._rList[2]).toEqual(ref3result);
        done();
      });

    it("should return false if activeId is not found",
      function (done) {
        self = this;
        spyOn(self.testRefs, "_rGetIndexByActiveId").and.returnValue(-1);
        expect(self.testRefs.rRemoveByActiveId("noId")).toBeFalsy();
        expect(self.testRefs._rList[0]).toEqual(ref1result);
        expect(self.testRefs._rList[1]).toEqual(ref2result);
        expect(self.testRefs._rList[2]).toEqual(ref3result);
        done();
      });

    it("should remove the reference corresponding to the given activeId",
      function (done) {
        self = this;
        spyOn(self.testRefs, "_rGetIndexByActiveId").and.returnValue(1);
        expect(self.testRefs.rRemoveByActiveId("12")).toBeTruthy();
        expect(self.testRefs._rList[0]).toEqual(ref1result);
        expect(self.testRefs._rList[1]).toBeUndefined();
        expect(self.testRefs._rList[2]).toEqual(ref3result);
        done();
      });
  });

  describe("rRemoveByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.obj;
      });

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
        expect(self.testRefs._rList[0]).toEqual(ref1result);
        expect(self.testRefs._rList[1]).toEqual(ref2result);
        expect(self.testRefs._rList[2]).toEqual(ref3result);
        done();
      });

    it("should return false if the refName is not found", function (done) {
      self = this;
      expect(self.testRefs.rRemoveByRefName("unknown"))
        .toBeFalsy();
      expect(self.testRefs._rList[0]).toEqual(ref1result);
      expect(self.testRefs._rList[1]).toEqual(ref2result);
      expect(self.testRefs._rList[2]).toEqual(ref3result);
      done();
    });

    it("should remove the reference", function (done) {
      self = this;
      expect(self.testRefs.rRemoveByRefName("name2"))
        .toBeTruthy();
      expect(self.testRefs._rList[0]).toEqual(ref1result);
      expect(self.testRefs._rList[1]).toBeUndefined();
      expect(self.testRefs._rList[2]).toEqual(ref3result);
      done();
    });
  });

  describe("rGetActiveIdByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noName;
      });

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

    it("should return null if the activeId is not found", function (done) {
      self = this;
      expect(self.testRefs.rGetActiveIdByRefName("unknown")).toBeNull();
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

  describe("rGetRefNameByActiveId", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });

      self.testRefs = new J.References(refsList, function () {
        spyOn(self.testRefs, "_rGetIndexByActiveId").
          and.callFake(function (activeId) {
          switch (activeId) {
            case "11":
              return 0;
            case "12":
              return 1;
            case "13":
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

    it("should return null if the activeId is not found", function (done) {
      self = this;
      expect(self.testRefs.rGetRefNameByActiveId("unknown")).toBeNull();
      done();
    });

    it("should return the activeId if the refName is found", function (done) {
      self = this;
      expect(self.testRefs.rGetRefNameByActiveId("11")).toEqual("name1");
      expect(self.testRefs.rGetRefNameByActiveId("12")).toEqual("name2");
      expect(self.testRefs.rGetRefNameByActiveId("13")).toEqual("name3");
      done();
    });
  });

  describe("rIsRefNameIn", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });

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

  describe("rIsActiveIdIn", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });

      self.testRefs = new J.References(refsList);
      spyOn(self.testRefs, "_rGetIndexByActiveId")
        .and.callFake(function (activeId) {
        switch (activeId) {
          case "11":
            return 0;
          case "12":
            return 1;
          case "13":
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
      expect(self.testRefs.rIsActiveIdIn("11")).toBeTruthy();
      expect(self.testRefs.rIsActiveIdIn("12")).toBeTruthy();
      expect(self.testRefs.rIsActiveIdIn("13")).toBeTruthy();
      done();
    });
  });

  describe("_rGetIndexByActiveId", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });
      spyOn(_, "indexOf").and.callThrough();

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

  describe("_rGetIndexByRefName", function () {
    beforeEach(function (done) {
      self = this;
      spyOn(Match, "test").and.callFake(function (value) {
        return !value.noId;
      });

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
