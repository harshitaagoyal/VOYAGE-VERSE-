const form = document.getElementById('currency-form');
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const resultDiv = document.getElementById('result');

const apiKey = '5bf1a8bb964eec7f78b1ad88';
const apiUrl = 'https://v6.exchangerate-api.com/v6/';

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (amount && from && to) {
        convertCurrency(amount, from, to);
    }
});

async function convertCurrency(amount, from, to) {
    const url = `${apiUrl}${apiKey}/latest/${from}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.result === 'success') {
            const exchangeRate = data.conversion_rates[to];
            const convertedAmount = (amount * exchangeRate).toFixed(2);
            resultDiv.innerHTML = `${amount} ${from} = ${convertedAmount} ${to}`;
        } else {
            resultDiv.innerHTML = 'Error fetching exchange rate. Please try again later.';
        }
    } catch (error) {
        resultDiv.innerHTML = 'Error: Unable to connect to the API.';
    }
}
