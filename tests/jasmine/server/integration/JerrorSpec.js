describe("J.Error", function () {

  it("should throw an Error", function () {
    expect(function(){throw new J.Error();}).toThrowError();
  });

  it("should get the correct stack in the details property", function(){
    expect((new J.Error()).stack.slice(0, 50))
      .toEqual((new Error()).stack.slice(0, 50));
  });
});