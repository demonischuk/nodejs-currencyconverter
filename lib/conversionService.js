const ConversionService = ((ratesApi) => {
    const convert = (currency, amount) => {
        currency = currency.toUpperCase();
        convertAmount = parseFloat(amount);

        return ratesApi.get()
            .catch(e => Promise.reject({
                code: e.type === "system" ? 500 : e.type,
                message: e.message
            }))
            .then(data => {
                if (typeof data.error !== "undefined") {
                    return Promise.reject({
                        code: 500,
                        message: data.error
                    });
                }
                
                if (typeof data.rates[currency] !== "undefined") {
                    return (data.rates[currency] * convertAmount);
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