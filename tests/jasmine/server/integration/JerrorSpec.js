describe("J.Error", function () {

  it("should throw an Error", function () {
    expect(function(){throw new J.Error();}).toThrowError();
  });
});