#! /usr/bin/env node
const inquirer = require("inquirer");

const ratesApi = require("../lib/ratesApi");
const validate = require("../lib/validation");

const conversionService = require("../lib/conversionService")(ratesApi);

const perform = (currency, amount) => {
    conversionService.convert(currency, amount)
        .then(convertedAmount => {
            console.log(`£${amount} into ${currency.toUpperCase()} is ${convertedAmount.toFixed()}`);
        })
        .catch(e => {
            console.log(`${e.code}: ${e.message}`);
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