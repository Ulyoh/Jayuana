/**
 * Created by yoh on 12/9/15.
 */

describe("J.References",function(){
  describe("_rCleanRef", function () {
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

      var j0 = {
        _jActiveId: 0,
        _jActiveName: "j0",
        _jDbId: 0,
        _jDbName: "db0"
      };
      var j1 = {
        _jActiveId: 1,
        _jActiveName: "j1",
        _jDbId: 1,
        _jDbName: "db1"
      };
      var j2 = {
        _jActiveId: 2,
        _jActiveName: "j2",
        _jDbId: 2,
        _jDbName: "db2"
      };
      var j3 = {
        _jActiveId: 3,
        _jActiveName: "j3",
        _jDbId: 3,
        _jDbName: "db3"
      };
      __.extend(j0,fakeJayuana);
      __.extend(j1,fakeJayuana);
      __.extend(j2,fakeJayuana);
      __.extend(j3,fakeJayuana);

      J._jActivated = [j0, j1, j2, j3];

      this.j0 = j0;
      this.j1 = j1;
      this.j2 = j2;
      this.j3 = j3;
    });

    afterEach(function () {
      J._jActivated = [];
    });
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
      var j2 = this.j2;
      expect(J.References._rCleanRef({activeId: 2, newRefName:"ref2"}))
        .toEqual({
          rRefName: "ref2",
          _rActiveId: 2,
          rActiveName: "j2",
          rDbId: 2,
          rDbName:  "db2",
          rActiveElt: j2
        });
    });

    it("should return a cleanRef by activeName", function () {
      var j2 = this.j2;
      debugger;
      expect(J.References._rCleanRef({activeName: "j2", newRefName:"ref2"}))
        .toEqual({
          rRefName: "ref2",
          _rActiveId: 2,
          rActiveName: "j2",
          rDbId: 2,
          rDbName:  "db2",
          rActiveElt: j2
        });
    });

    it("should give the activeName as the reference name if newRefName is " +
      "not specify ", function () {
      var j2 = this.j2;
      expect(J.References._rCleanRef({activeId: 2}))
        .toEqual({
          rRefName: "j2",
          _rActiveId: 2,
          rActiveName: "j2",
          rDbId: 2,
          rDbName:  "db2",
          rActiveElt: j2
        });
    });

  });

  xdescribe("_rCleanRefFor", function () {

    it("should throw an error if the reference name already exists",
      function () {
        var j0 = this.j0;
        expect(function () {
          j0._jRefsTo._rCleanRef({activeId: 3, newRefName:"j1"});
        }).toThrowError('');

      });

    it("should throw an error if a reference to the active Jayuana already " +
      "exists", function () {
      var j0 = this.j0;
      expect(function () {
        j0._jRefsTo._rCleanRef({activeId: 2, newRefName:"already exists"});
      }).toThrowError('');
    });
  });
});