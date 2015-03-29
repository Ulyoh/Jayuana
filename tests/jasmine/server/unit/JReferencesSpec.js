
describe("Jayuana.References", function () {
   beforeEach(function () {
      spyOn(J, "error").and.callFake(function (a, b, c) {
         if (!c){
            c = "stub stack";
         }
         var error = {};
         error.shortMsg = a;
         error.reason = b;
         error.details = c;
         return error;
      });

   });

   describe("constructor", function () {

      it("should throw an error if no argument passed", function () {
         expect(function () {
            new J.References();
         }).toThrow({
            shortMsg: 'References constructor',
            reason: 'missing argument',
            details: 'stub stack' });
      });

      describe("add", function () {
         it("should throw an error if invalid argument passed", function () {
            spyOn(Match, "test").and.callFake(function (value) {
               return value !== "invalid";
            });

            expect(function () {
               new J.References("invalid");
            }).toThrow({
               shortMsg: "References add",
               reason: "invalid or not object passed to add method",
               details: 'stub stack' });
         });

         it("should add a reference to the reference list", function () {
            spyOn(Match, "test").and.callFake(function (value, pattern) {
               return pattern !== Array;
            });

            var testRefs = new J.References({name: "name", id: "id"});
            expect(testRefs._list[0]).toEqual({name: "name", id: "id"});
         });

         it("should add an array of references to the reference list and" +
            " have only id and name as properties",
            function () {
               spyOn(Match, "test").and.returnValue(true);

               var refsList = [
                  {name: "name1", id: "id1", somethingElse: "thing"},
                  {name: "name2", id: "id2"},
                  {name: "name3", id: "id3"}
               ];
               var testRefs = new J.References(refsList);

               expect(testRefs._list[0]).toEqual({id: "id1", name: "name1"});
               expect(testRefs._list[1]).toEqual({id: "id2", name: "name2"});
               expect(testRefs._list[2]).toEqual({id: "id3", name: "name3"});
            });

      });

   });

   describe("removeById", function () {
      beforeEach(function () {
         spyOn(Match, "test").and.callFake(function (value) {
            return !value.noId;
         });
         var refsList = [
            {name: "name1", id: "id1"},
            {name: "name2", id: "id2"},
            {name: "name3", id: "id3"}
         ];
         this.testRefs = new J.References(refsList);
      });

      it("should throw an error if argument is not a string",
         function () {
            var that = this;
            expect(function () {
               that.testRefs.removeById({noId: "noId"});
            }).toThrow({
               shortMsg: 'References',
               reason: "method removeById: id argument is not a string",
               details: 'stub stack'
            });
            expect(this.testRefs._list[0]).toEqual({id: "id1", name: "name1"});
            expect(this.testRefs._list[1]).toEqual({id: "id2", name: "name2"});
            expect(this.testRefs._list[2]).toEqual({id: "id3", name: "name3"});
         });

      it("should throw an error if id is not found",
         function () {
            spyOn(this.testRefs, "_getIndexById").and.returnValue(-1);
            var that = this;
            expect(function () {
               that.testRefs.removeById("noId");
            }).toThrow({
               shortMsg: 'References',
               reason: "method removeById: id not found",
               details: 'stub stack'
            });
            expect(this.testRefs._list[0]).toEqual({id: "id1", name: "name1"});
            expect(this.testRefs._list[1]).toEqual({id: "id2", name: "name2"});
            expect(this.testRefs._list[2]).toEqual({id: "id3", name: "name3"});
         });

      it("should remove the reference corresponding to the given id",
         function () {
            spyOn(this.testRefs, "_getIndexById").and.returnValue(1);
            this.testRefs.removeById("id2");

            expect(this.testRefs._list[0]).toEqual({id: "id1", name: "name1"});
            expect(this.testRefs._list[1]).toBeUndefined();
            expect(this.testRefs._list[2]).toEqual({id: "id3", name: "name3"});
         });
   });

   describe("removeByName", function () {
      beforeEach(function () {
         spyOn(Match, "test").and.callFake(function (value) {
            return !value.noName;
         });
         var refsList = [
            {name: "name1", id: "id1"},
            {name: "name2", id: "id2"},
            {name: "name3", id: "id3"}
         ];
         this.testRefs = new J.References(refsList);
         spyOn(this.testRefs, "_getIndexByName").and.callFake(function (name) {
            switch(name){
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
      it("should throw an error if argument is not a string",
         function () {
         //   spyOn(this.testRefs, "_getIndexByName").and.returnValue(-1);
            var that = this;
            expect(function () {
               that.testRefs.removeByName({noName: "noName"});
            }).toThrow({
               shortMsg: 'References',
               reason: "method removeByName: argument is not a string",
               details: 'stub stack'
            });
            expect(this.testRefs._list[0]).toEqual({id: "id1", name: "name1"});
            expect(this.testRefs._list[1]).toEqual({id: "id2", name: "name2"});
            expect(this.testRefs._list[2]).toEqual({id: "id3", name: "name3"});
         });

      it("should throw an error if the name is not found", function () {
         var that = this;
         expect(function () {
            that.testRefs.removeByName("unknown");
         }).toThrow({
            shortMsg: 'References',
            reason: "method removeByName: name not found",
            details: 'stub stack'
         });
         expect(this.testRefs._list[0]).toEqual({id: "id1", name: "name1"});
         expect(this.testRefs._list[1]).toEqual({id: "id2", name: "name2"});
         expect(this.testRefs._list[2]).toEqual({id: "id3", name: "name3"});
      });

      it("should remove the reference", function () {

         this.testRefs.removeByName("name2");
         expect(this.testRefs._list[0]).toEqual({id: "id1", name: "name1"});
         expect(this.testRefs._list[1]).toBeUndefined();
         expect(this.testRefs._list[2]).toEqual({id: "id3", name: "name3"});
      });
   });

   describe("getIdByName", function () {
      beforeEach(function () {
         spyOn(Match, "test").and.callFake(function (value) {
            return !value.noName;
         });
         var refsList = [
            {name: "name1", id: "id1"},
            {name: "name2", id: "id2"},
            {name: "name3", id: "id3"}
         ];
         this.testRefs = new J.References(refsList);
         spyOn(this.testRefs, "_getIndexByName").and.callFake(function (name) {
            switch(name){
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

      it("should throw an error if argument is not a string",
         function () {
            var that = this;
            expect(function () {
               that.testRefs.getIdByName({noName: "noName"});
            }).toThrow({
               shortMsg: 'References',
               reason: "method getIdByName: argument is not a string",
               details: 'stub stack'
            });
         });

      it("should throw an error if the id is not found", function () {
         var that = this;
         expect(function () {
            that.testRefs.getIdByName("unknown");
         }).toThrow({
            shortMsg: 'References',
            reason: "method getIdByName: name not found",
            details: 'stub stack'
         });
      });

      it("should return the id if the name is found", function () {
         expect(this.testRefs.getIdByName("name1")).toEqual("id1");
         expect(this.testRefs.getIdByName("name2")).toEqual("id2");
         expect(this.testRefs.getIdByName("name3")).toEqual("id3");
      });
   });

   describe("getNameById", function () {
      beforeEach(function () {
         spyOn(Match, "test").and.callFake(function (value) {
            return !value.noId;
         });
         var refsList = [
            {name: "name1", id: "id1"},
            {name: "name2", id: "id2"},
            {name: "name3", id: "id3"}
         ];
         this.testRefs = new J.References(refsList);
         spyOn(this.testRefs, "_getIndexById").and.callFake(function (id) {
            switch(id){
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

      it("should throw an error if argument is not a string",
         function () {
            var that = this;
            expect(function () {
               that.testRefs.getNameById({noId: "noId"});
            }).toThrow({
               shortMsg: 'References',
               reason: "method getNameById: argument is not a string",
               details: 'stub stack'
            });
         });

      it("should throw an error if the id is not found", function () {
         var that = this;
         expect(function () {
            that.testRefs.getNameById("unknown");
         }).toThrow({
            shortMsg: 'References',
            reason: "method getNameById: id not found",
            details: 'stub stack'
         });
      });

      it("should return the id if the name is found", function () {
         expect(this.testRefs.getNameById("id1")).toEqual("name1");
         expect(this.testRefs.getNameById("id2")).toEqual("name2");
         expect(this.testRefs.getNameById("id3")).toEqual("name3");
      });
   });

   xdescribe("isNameIn");

   xdescribe("isIdIn");

   xdescribe("_getIndexById");

   xdescribe("_getIndexByName");

   xdescribe("patternOneRef");

   xdescribe("patternArg");

});
