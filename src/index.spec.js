
var greetings = require("./index");

describe('Addition', () => {
    it('knows that 2 and 2 make 4', () => {
      expect(2 + 2).toBe(4);
    });
  });

describe('Greeting', () => {
  it('knows that hello returns HELLO', () => {
    expect( greetings.hello() ).toBe("HELLO");
  });
});
