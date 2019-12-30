const conversionService = require("../lib/conversionService");

const mockRates = (rates) => {
    return {
        get: () => Promise.resolve({
            rates: rates
        })
    };
};


test("Currency does not exist", () => {
    const subject = conversionService(mockRates({ EUR: 12}));

    expect.assertions(2);
    return subject.convert("ABC", 12)
    .catch(e => {
        expect(e.code).toBe(404);
        expect(e.message).toBe("Unknown currency \"ABC\". Possible options are: EUR");
    });
});