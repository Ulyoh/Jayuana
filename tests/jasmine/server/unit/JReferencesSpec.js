
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
   });
});
