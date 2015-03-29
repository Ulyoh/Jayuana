
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
            expect(testRefs._list["name"]).toEqual("id");
         });

         it("should add an array of references to the reference list",
            function () {
            spyOn(Match, "test").and.returnValue(true);

            var refsList = [
               {name: "name1", id: "id1"},
               {name: "name2", id: "id2"},
               {name: "name3", id: "id3"}
            ];
            var testRefs = new J.References(refsList);

            expect(testRefs._list["name1"]).toEqual("id1");
            expect(testRefs._list["name2"]).toEqual("id2");
            expect(testRefs._list["name3"]).toEqual("id3");
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
         });


      it("should throw an error if id is not found",
         function () {
            spyOn(this.testRefs, "isIdIn").and.returnValue(false);
            var that = this;
            expect(function () {
               that.testRefs.removeById("noId");
            }).toThrow({
               shortMsg: 'References',
               reason: "method removeById: id not found",
               details: 'stub stack'
            });
         });

      it("should remove the reference corresponding to the given id",
         function () {
            spyOn(this.testRefs, "isIdIn").and.returnValue(true);
            spyOn(this.testRefs, "getName").and.returnValue("name2");

            this.testRefs.removeById("id2");

            expect(this.testRefs._list["name1"]).toEqual("id1");
            expect(this.testRefs._list["name2"]).toBeUndefined();
            expect(this.testRefs._list["name3"]).toEqual("id3");
         });

      xit("should remove the reference corresponding to the name given",
         function () {

         });
   });
});
