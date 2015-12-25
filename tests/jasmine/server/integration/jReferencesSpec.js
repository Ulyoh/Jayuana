/**
 * Created by yoh on 12/9/15.
 */

describe("J.References",function(){
  beforeEach(function () {
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
      _jActiveName: "Jtest0",
      _jDbId: 0,
      _jDbName: "db0"
    };
    var Jtest1 = {
      _jActiveId: 11,
      _jActiveName: "Jtest1",
      _jDbId: 1,
      _jDbName: "db1"
    };
    var Jtest2 = {
      _jActiveId: 12,
      _jActiveName: "Jtest2",
      _jDbId: 2,
      _jDbName: "db2"
    };
    var Jtest3 = {
      _jActiveId: 13,
      _jActiveName: "Jtest3",
      _jDbId: 3,
      _jDbName: "db3"
    };
    __.extend(Jtest0,fakeJayuana);
    __.extend(Jtest1,fakeJayuana);
    __.extend(Jtest2,fakeJayuana);
    __.extend(Jtest3,fakeJayuana);

    //J._jActivated = [Jtest0, Jtest1, Jtest2, Jtest3];
    J._jActivated[10]=Jtest0;
    J._jActivated[11]=Jtest1;
    J._jActivated[12]=Jtest2;
    J._jActivated[13]=Jtest3;

    this.Jtest0 = Jtest0;
    this.Jtest1 = Jtest1;
    this.Jtest2 = Jtest2;
    this.Jtest3 = Jtest3;

    this.ref1result = {
      rRefName: "name1",
      _rActiveId: 11,
      rActiveName: 'Jtest1',
      rDbId: 1,
      rDbName: 'db1',
      rActiveElt: Jtest1,
      _rRefId: 0};
    this.ref2result = {
      rRefName: "name2",
      _rActiveId: 12,
      rActiveName: 'Jtest2',
      rDbId: 2,
      rDbName: 'db2',
      rActiveElt: Jtest2,
      _rRefId: 1};
    this.ref3result = {
      rRefName: "name3",
      _rActiveId: 13,
      rActiveName: 'Jtest3',
      rDbId: 3,
      rDbName: 'db3',
      rActiveElt: Jtest3,
      _rRefId: 2};

    this.refsList = [
      {newRefName: "name1", activeId: 11, somethingElse: "thing"},
      {newRefName: "name2", activeId: 12},
      {newRefName: "name3", activeName: "Jtest3"}
    ];
  });
  afterEach(function () {
    J._jActivated = [];
  });

  describe("constructor", function () {

    it("should throw an Error if no argument passed", function () {
      utils.v("+ Ref.constr.rAdd throw Error no arg");
      //var self = this;
      expect(function () {
        new J.References();
      }).toThrowError(J.Error, 'missing argument [References constructor]');
      utils.v("- Ref.constr.rAdd throw Error no arg");
    });

    it("should create an empty Reference object if argument is null",
      function () {
        utils.v("+ Ref.constr.rAdd create empty elt");
        //var self = this;
        var refNull = new J.References(null);
        expect(refNull._rList.length).toEqual(0);
        utils.v("- Ref.constr.rAdd create empty elt");
      });

    xit("should throw an Error if not called with the new keyword");

    describe("rAdd", function () {
      it("should throw an Error if invalid argument passed", function () {
        expect(function () {
          new J.References("invalid");
        }).toThrowError(J.Error, 'invalid or not object passed to _rCleanRef ' +
          'method [References _rCleanRef]');
      });

      it("should add a reference to the reference list", function (done) {
        utils.v("+ Ref.constr.rAdd add ref to ref list");
        var jasmineSelf = this;
        new J.References({newRefName: "rRefName", activeId: 11},
          function () {
            var self = this;
            expect(self._rList[0]).toEqual({
              rRefName: "rRefName",
              _rActiveId: 11,
              rActiveName: 'Jtest1',
              rDbId: 1,
              rDbName: 'db1',
              rActiveElt: jasmineSelf.Jtest1,
              _rRefId: 0});
            utils.v("- Ref.constr.rAdd add ref to ref list");
            done();
          });
      });

      it("should add an array of references to the reference list and" +
        " have only rRefName, activeElt, _rRefId and _rActiveId as properties",
        function (done) {
          utils.v("+ Ref.constr.rAdd add ref array to ref list");
          var jasmineSelf = this;
          spyOn(Match, "test").and.returnValue(true);

          new J.References(jasmineSelf.refsList, function () {
            var self = this;
            expect(self._rList[0]).toEqual({
              rRefName: "name1",
              _rActiveId: 11,
              rActiveName: 'Jtest1',
              rDbId: 1,
              rDbName: 'db1',
              rActiveElt: jasmineSelf.Jtest1,
              _rRefId: 0});
            expect(self._rList[1]).toEqual({
              rRefName: "name2",
              _rActiveId: 12,
              rActiveName: 'Jtest2',
              rDbId: 2,
              rDbName: 'db2',
              rActiveElt: jasmineSelf.Jtest2,
              _rRefId: 1});
            expect(self._rList[2]).toEqual({
              rRefName: "name3",
              _rActiveId: 13,
              rActiveName: 'Jtest3',
              rDbId: 3,
              rDbName: 'db3',
              rActiveElt: jasmineSelf.Jtest3,
              _rRefId: 2});
            utils.v("- Ref.constr.rAdd add ref array to ref list");
            done();
          });

        });

    });

  });

  describe("rRemoveByActiveId", function () {
    beforeEach(function (done) {
      var self = this;
      self.testRefs = new J.References(self.refsList, function () {
        done();
      });
    });

    it("should throw an Error if argument is not a string",
      function (done) {
        var self = this;
        expect(function () {
          self.testRefs.rRemoveByActiveId({noId: "noId"});})
          .toThrowError(J.Error,"method rRemoveByActiveId: activeId argument" +
          " is not a number [References]");
        expect(self.testRefs._rList[0]).toEqual(self.ref1result);
        expect(self.testRefs._rList[1]).toEqual(self.ref2result);
        expect(self.testRefs._rList[2]).toEqual(self.ref3result);
        done();
      });

    it("should return false if activeId is not found",
      function (done) {
        var self = this;
        spyOn(self.testRefs, "_rGetIndexByActiveId").and.returnValue(-1);
        expect(self.testRefs.rRemoveByActiveId(100)).toBeFalsy();
        expect(self.testRefs._rList[0]).toEqual(self.ref1result);
        expect(self.testRefs._rList[1]).toEqual(self.ref2result);
        expect(self.testRefs._rList[2]).toEqual(self.ref3result);
        done();
      });

    it("should remove the reference corresponding to the given activeId",
      function (done) {
        var self = this;
        spyOn(self.testRefs, "_rGetIndexByActiveId").and.returnValue(1);
        expect(self.testRefs.rRemoveByActiveId(12)).toBeTruthy();
        expect(self.testRefs._rList[0]).toEqual(self.ref1result);
        expect(self.testRefs._rList[1]).toBeUndefined();
        expect(self.testRefs._rList[2]).toEqual(self.ref3result);
        done();
      });
  });

  describe("rRemoveByRefName", function () {
    beforeEach(function (done) {
      var self = this;
      self.testRefs = new J.References(self.refsList, function () {
        done();
      });

    });
    it("should throw an Error if argument is not a string",
      function (done) {
        //   spyOn(self.testRefs, "_rGetIndexByRefName").and.returnValue(-1);
        var self = this;
        expect(function () {
          self.testRefs.rRemoveByRefName({obj: "this is an obj"});
        }).toThrowError(J.Error,
          "method rRemoveByRefName: argument is not a string [References]");
        expect(self.testRefs._rList[0]).toEqual(self.ref1result);
        expect(self.testRefs._rList[1]).toEqual(self.ref2result);
        expect(self.testRefs._rList[2]).toEqual(self.ref3result);
        done();
      });

    it("should return false if the refName is not found", function (done) {
      var self = this;
      expect(self.testRefs.rRemoveByRefName("unknown"))
        .toBeFalsy();
      expect(self.testRefs._rList[0]).toEqual(self.ref1result);
      expect(self.testRefs._rList[1]).toEqual(self.ref2result);
      expect(self.testRefs._rList[2]).toEqual(self.ref3result);
      done();
    });

    it("should remove the reference", function (done) {
      var self = this;
      expect(self.testRefs.rRemoveByRefName("name2"))
        .toBeTruthy();
      expect(self.testRefs._rList[0]).toEqual(self.ref1result);
      expect(self.testRefs._rList[1]).toBeUndefined();
      expect(self.testRefs._rList[2]).toEqual(self.ref3result);
      done();
    });
  });

  describe("rGetActiveIdByRefName", function () {
    beforeEach(function (done) {
      var self = this;
      self.testRefs = new J.References(self.refsList, function () {
        done();
      });
    });

    it("should throw an Error if argument is not a string",
      function (done) {
        var self = this;
        expect(function () {
          self.testRefs.rGetActiveIdByRefName({noName: "noName"});
        }).toThrowError(J.Error,
          "method rGetActiveIdByRefName: argument is not a string [References]");
        done();
      });

    it("should return null if the activeId is not found", function (done) {
      var self = this;
      expect(self.testRefs.rGetActiveIdByRefName("unknown")).toBeNull();
      done();
    });

    it("should return the activeId if the refName is found", function (done) {
      var self = this;
      expect(self.testRefs.rGetActiveIdByRefName("name1")).toEqual(11);
      expect(self.testRefs.rGetActiveIdByRefName("name2")).toEqual(12);
      expect(self.testRefs.rGetActiveIdByRefName("name3")).toEqual(13);
      done();
    });
  });

  describe("rGetRefNameByActiveId", function () {
    beforeEach(function (done) {
      var self = this;
      self.testRefs = new J.References(self.refsList, function () {
        done();
      });
    });

    it("should throw an Error if argument is not a number",
      function (done) {
        var self = this;
        expect(function () {
          self.testRefs.rGetRefNameByActiveId({noId: "noId"});
        }).toThrowError(J.Error,
          "method rGetRefNameByActiveId: argument is not a Number [References]"
        );
        done();
      });

    it("should return null if the activeId is not found", function (done) {
      var self = this;
      expect(self.testRefs.rGetRefNameByActiveId(100)).toBeNull();
      done();
    });

    it("should return the activeId if the refName is found", function (done) {
      var self = this;
      debugger;
      expect(self.testRefs.rGetRefNameByActiveId(11)).toEqual("name1");
      expect(self.testRefs.rGetRefNameByActiveId(12)).toEqual("name2");
      expect(self.testRefs.rGetRefNameByActiveId(13)).toEqual("name3");
      done();
    });
  });

  describe("rIsRefNameIn", function () {
    beforeEach(function (done) {
      var self = this;
      self.testRefs = new J.References(self.refsList, function () {
        done();
      });
    });
    it("should return false if the refName is not found", function (done) {
      var self = this;
      expect(self.testRefs.rIsRefNameIn("unknown")).toBeFalsy();
      done();
    });
    it("should return true if the refName is found", function (done) {
      var self = this;
      expect(self.testRefs.rIsRefNameIn("name1")).toBeTruthy();
      expect(self.testRefs.rIsRefNameIn("name2")).toBeTruthy();
      expect(self.testRefs.rIsRefNameIn("name3")).toBeTruthy();
      done();
    });
  });

  describe("rIsActiveIdIn", function () {
    beforeEach(function (done) {
      var self = this;
      self.testRefs = new J.References(self.refsList, function () {
        done();
      });
    });
    it("should return false if activeId is not found", function (done) {
      var self = this;
      expect(self.testRefs.rIsActiveIdIn("unknown")).toBeFalsy();
      done();
    });
    it("should return true if activeId is found", function (done) {
      var self = this;
      expect(self.testRefs.rIsActiveIdIn(11)).toBeTruthy();
      expect(self.testRefs.rIsActiveIdIn(12)).toBeTruthy();
      expect(self.testRefs.rIsActiveIdIn(13)).toBeTruthy();
      done();
    });
  });

  describe("_rGetIndexByActiveId", function () {
    beforeEach(function (done) {
      var self = this;
      self.testRefs = new J.References(self.refsList, function () {
        done();
      });
    });

    it("should return -1 if the given Id is not found", function (done) {
      var self = this;
      expect(self.testRefs._rGetIndexByActiveId("unknown")).toEqual(-1);
      done();
    });

    it("should return the corresponding index to the given Id",
      function (done) {
        var self = this;
        expect(self.testRefs._rGetIndexByActiveId(11)).toEqual(0);
        expect(self.testRefs._rGetIndexByActiveId(12)).toEqual(1);
        expect(self.testRefs._rGetIndexByActiveId(13)).toEqual(2);
        done();
      });
  });

  describe("_rGetIndexByRefName", function () {
    beforeEach(function (done) {
      var self = this;
      self.testRefs = new J.References(self.refsList, function () {
        done();
      });
    });
    it("should return -1 if the given refName is not found",
      function (done) {
        var self = this;
        expect(self.testRefs._rGetIndexByRefName("unknown")).toEqual(-1);
        done();
      });
    it("should return the corresponding index to the given refName",
      function (done) {
        var self = this;
        expect(self.testRefs._rGetIndexByRefName("name1")).toEqual(0);
        expect(self.testRefs._rGetIndexByRefName("name2")).toEqual(1);
        expect(self.testRefs._rGetIndexByRefName("name3")).toEqual(2);
        done();

      });
  });

  describe("_rCleanRef", function () {

    it("should throw an error if it does not find any Jayuana object by " +
      "activeId",
      function () {
        utils.v("+ Ref._rCleanRef throw Error no Jayuana obj  by activeId");
        expect(function () {
          J.References._rCleanRef({activeId: 100});
        })
          .toThrowError('not active Jayuana with this activeId ' +
          '[J.jGetActiveByActiveId]');

        utils.v("+ Ref._rCleanRef throw Error no Jayuana obj by activeId");
    });

    it("should throw an error if it does not find any Jayuana object by " +
      "activeName", function () {
        utils.v("+ Ref._rCleanRef throw Error no Jayuana obj by activeName");
        expect(function () {
          J.References._rCleanRef({activeName: "noName"});
        })
          .toThrowError('index not found, index: -1 [J._jGetActiveBy]');

        utils.v("+ Ref._rCleanRef throw Error no Jayuana obj by activeName");
      });

    it("should return a cleanRef by activeId", function () {
      var Jtest2 = this.Jtest2;
      expect(J.References._rCleanRef({activeId: 12, newRefName:"ref2"}))
        .toEqual({
          rRefName: "ref2",
          _rActiveId: 12,
          rActiveName: "Jtest2",
          rDbId: 2,
          rDbName:  "db2",
          rActiveElt: Jtest2
        });
    });

    it("should return a cleanRef by activeName", function () {
      var Jtest2 = this.Jtest2;
      expect(J.References._rCleanRef({activeName: "Jtest2", newRefName:"ref2"}))
        .toEqual({
          rRefName: "ref2",
          _rActiveId: 12,
          rActiveName: "Jtest2",
          rDbId: 2,
          rDbName:  "db2",
          rActiveElt: Jtest2
        });
    });

    it("should give the activeName as the reference name if newRefName is " +
      "not specify ", function () {
      var Jtest2 = this.Jtest2;
      expect(J.References._rCleanRef({activeId: 12}))
        .toEqual({
          rRefName: "Jtest2",
          _rActiveId: 12,
          rActiveName: "Jtest2",
          rDbId: 2,
          rDbName:  "db2",
          rActiveElt: Jtest2
        });
    });

  });

  xdescribe("_rCleanRefFor", function () {

    it("should throw an error if the reference name already exists",
      function () {
        var Jtest0 = this.Jtest0;
        expect(function () {
          Jtest0._jRefsTo._rCleanRef({activeId: 13, newRefName:"Jtest1"});
        }).toThrowError('');

      });

    it("should throw an error if a reference to the active Jayuana already " +
      "exists", function () {
      var Jtest0 = this.Jtest0;
      expect(function () {
        Jtest0._jRefsTo._rCleanRef({activeId: 12, newRefName:"already exists"});
      }).toThrowError('');
    });
  });



});