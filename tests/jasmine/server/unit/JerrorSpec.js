describe("J.Error", function () {
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
  });

  it("should return 'unknown Error' and stack if call " +
    "without arguments",
    function () {
    var testError = new J.Error();
    expect(testError.error).toEqual("unknown Error");
    expect(testError.reason).toEqual(" ");
    expect(testError.details).toBeDefined();
  });
  it("should return the Error and reason messages and stack if" +
  "called with two arguments", function () {
    var testError = new J.Error(errorMsg, reason);
    expect(testError.error).toEqual(errorMsg);
    expect(testError.reason).toEqual(reason);
    expect(testError.details).toBeDefined();
  });
  it("should return the Error, reason and details messages if" +
  "called with three arguments", function () {
    var testError = new J.Error(errorMsg, reason, details);
    expect(testError.error).toEqual(errorMsg);
    expect(testError.reason).toEqual(reason);
    expect(testError.details).toEqual(details);
  });
});