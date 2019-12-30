const ConversionService = ((ratesApi) => {
    const convert = (currency, amount) => {
        currency = currency.toUpperCase();
        convertAmount = parseFloat(amount);

        return ratesApi.get()
            .then(data => {
                if (typeof data.rates[currency] !== "undefined") {
                    return `£${convertAmount} into ${currency} is ${(data.rates[currency] * convertAmount).toFixed(2)}`;
                }

                let possible = [];

                for (c in data.rates) {
                    possible.push(c);
                }

                return Promise.reject({
                    code: 404,
                    message: `Unknown currency "${currency}". Possible options are: ${possible.join(", ")}`
                });
            });
    };

    return {
        convert
    };
});

module.exports = ConversionService;