#! /usr/bin/env node

const fetch = require("node-fetch");
const inquirer = require("inquirer");

const validate = require("../lib/validation");

const perform = (currency, amount) => {
    currency = currency.toUpperCase();
    convertAmount = parseFloat(amount);
    
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
};

const performViaCommandArgs = () => {
    if (process.argv.length != 4) {
        console.log("Expected a 3 letter currency code an an amount to be specified");
        return;
    }

    const currency = process.argv[2];
    const amount = parseFloat(process.argv[3]);

    const currencyValidation = validate.currency(currency);
    const amountValidation = validate.amount(amount);

    if (currencyValidation === true && amountValidation === true) {
        perform(currency, amount);
        return;
    }
    
    if (typeof currencyValidation === "string") {
        console.log(currencyValidation);
    }

    if (typeof amountValidation === "string") {
        console.log(amountValidation);
    } 
};

const performViaPrompts = () => {
    inquirer.prompt([{
        type: "input",
        name: "currency",
        message: "Currency to convert to",
        default: "EUR",
        validate: validate.currency
    },
    {
        type: "input",
        name: "amount",
        message: "Amount to convert",
        validate: validate.amount
    }])
    .then(answers => {
        perform(answers.currency, answers.amount);        
    });
};

process.argv.length > 2 ? performViaCommandArgs() : performViaPrompts();