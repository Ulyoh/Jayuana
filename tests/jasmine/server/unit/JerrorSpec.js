xdescribe("Jayuana.error", function () {
   var errorMsg = "error";
   var reason = "reason";
   var details = "details";
   beforeEach(function () {
      spyOn(Match, "test").and.callFake(function (arg) {
         if ((arg === errorMsg) || (arg === reason) ||
            (arg === details)) {
            return true;
         }
         else {
            return undefined;
         }
      });
      spyOn(Meteor, "Error").and.callFake(function (a, b, c) {
         this.shortMsg = a;
         this.reason = b;
         this.details = c;
      });
   });

   it("should return 'unknown error' and stack if call " +
      "without arguments",
      function () {
      var testError = J.error();
      expect(testError.shortMsg).toEqual("unknown error");
      expect(testError.reason).toEqual(" ");
      expect(testError.details).toBeDefined();
   });
   it("should return the error and reason messages and stack if" +
   "called with two arguments", function () {
      var testError = J.error(errorMsg, reason);
      expect(testError.shortMsg).toEqual(errorMsg);
      expect(testError.reason).toEqual(reason);
      expect(testError.details).toBeDefined();
   });
   it("should return the error, reason and details messages if" +
   "called with three arguments", function () {
      var testError = J.error(errorMsg, reason, details);
      expect(testError.shortMsg).toEqual(errorMsg);
      expect(testError.reason).toEqual(reason);
      expect(testError.details).toEqual(details);
   });
});