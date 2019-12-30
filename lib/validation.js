module.exports = {
    currency: (value) => {
        if (new RegExp("^[a-zA-Z]{3}$").test(value)) {
            return true;
        }

        return "Please enter a valid 3 letter currency";
    },
    amount: (value) => {
        if (isNaN(value)) {
            return "Please enter a valid amount";
        }

        return true;
    }
};