#! /usr/bin/env node

const fetch = require("node-fetch");
const inquirer = require("inquirer");

inquirer.prompt([{
    type: "input",
    name: "currency",
    message: "Currency to convert to",
    default: "EUR",
    validate: (value) => {
        if (new RegExp("^[a-zA-Z]{3}$").test(value)) {
            return true;
        }

        return "Please enter a valid 3 letter currency";
    }
},
{
    type: "input",
    name: "amount",
    message: "Amount to convert",
    validate: (value) => {
        if (isNaN(value)) {
            return "Please enter a valid amount";
        }

        return true;
    }
}])
.then(answers => {
    const currency = answers.currency.toUpperCase();
    const convertAmount = parseFloat(answers.amount);
    
    fetch("https://api.exchangeratesapi.io/latest?base=GBP")
        .then(response => response.json())
        .then(data => {
            if (typeof data.rates[currency] === "undefined") {
                let possible = [];
    
                for (c in data.rates) {
                    possible.push(c);
                }
    
                console.log(`Unknown currency "${currency}. Possible options are: ${possible.join(", ")}`);
            } else {
                console.log(`£${convertAmount} into ${currency} is ${(data.rates[currency] * convertAmount).toFixed(2)}`);
            }
        });
});