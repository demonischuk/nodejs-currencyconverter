const fetch = require("node-fetch");

module.exports = {
    get: () => {
        return fetch("https://api.exchangeratesapi.io/latest?base=GBP")
        .then(response => response.json());
    }
};