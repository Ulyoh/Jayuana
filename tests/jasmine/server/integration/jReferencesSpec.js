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

      var Jtest0 = {
        _jActiveId: 0,
        _jActiveName: "Jtest0",
        _jDbId: 0,
        _jDbName: "db0"
      };
      var Jtest1 = {
        _jActiveId: 1,
        _jActiveName: "Jtest1",
        _jDbId: 1,
        _jDbName: "db1"
      };
      var Jtest2 = {
        _jActiveId: 2,
        _jActiveName: "Jtest2",
        _jDbId: 2,
        _jDbName: "db2"
      };
      var Jtest3 = {
        _jActiveId: 3,
        _jActiveName: "Jtest3",
        _jDbId: 3,
        _jDbName: "db3"
      };
      __.extend(Jtest0,fakeJayuana);
      __.extend(Jtest1,fakeJayuana);
      __.extend(Jtest2,fakeJayuana);
      __.extend(Jtest3,fakeJayuana);

      J._jActivated = [Jtest0, Jtest1, Jtest2, Jtest3];

      this.Jtest0 = Jtest0;
      this.Jtest1 = Jtest1;
      this.Jtest2 = Jtest2;
      this.Jtest3 = Jtest3;


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
      var Jtest2 = this.Jtest2;
      expect(J.References._rCleanRef({activeId: 2, newRefName:"ref2"}))
        .toEqual({
          rRefName: "ref2",
          _rActiveId: 2,
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
          _rActiveId: 2,
          rActiveName: "Jtest2",
          rDbId: 2,
          rDbName:  "db2",
          rActiveElt: Jtest2
        });
    });

    it("should give the activeName as the reference name if newRefName is " +
      "not specify ", function () {
      var Jtest2 = this.Jtest2;
      expect(J.References._rCleanRef({activeId: 2}))
        .toEqual({
          rRefName: "Jtest2",
          _rActiveId: 2,
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
          Jtest0._jRefsTo._rCleanRef({activeId: 3, newRefName:"Jtest1"});
        }).toThrowError('');

      });

    it("should throw an error if a reference to the active Jayuana already " +
      "exists", function () {
      var Jtest0 = this.Jtest0;
      expect(function () {
        Jtest0._jRefsTo._rCleanRef({activeId: 2, newRefName:"already exists"});
      }).toThrowError('');
    });
  })



});