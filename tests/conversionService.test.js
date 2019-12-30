const conversionService = require("../lib/conversionService");

const mockRates = (rates) => {
    return {
        get: () => Promise.resolve({
            rates: rates
        })
    };
};

test("Currency lowercase exists", () => {
    const subject = conversionService(mockRates({ EUR: 1.75}));

    return subject.convert("eur", 10)
    .then(amount => {
        expect(amount).toBe(17.50);
    });
});

test("Currency uppercase exists", () => {
    const subject = conversionService(mockRates({ EUR: 1.75}));

    return subject.convert("EUR", 10)
    .then(amount => {
        expect(amount).toBe(17.50);
    });
});

test("Currency does not exist", () => {
    const subject = conversionService(mockRates({ EUR: 1.75}));

    expect.assertions(2);
    return subject.convert("ABC", 10)
    .catch(e => {
        expect(e.code).toBe(404);
        expect(e.message).toBe("Unknown currency \"ABC\". Possible options are: EUR");
    });
});

test("Api throws error", () => {
    const subject = conversionService({
        get: () => Promise.reject({
            type: 500,
            message: "Service is down"
        })
    });

    expect.assertions(2);
    return subject.convert("EUR", 10)
    .catch(e => {
        expect(e.code).toBe(500);
        expect(e.message).toBe("Service is down");
    });
});