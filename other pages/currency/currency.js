//humberg logic
const humberg = document.querySelector('.humberg');
const menu = document.querySelector('.hamburger-menu');

// Function to toggle the hamburger menu
humberg.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click from propagating to the document
    menu.classList.toggle('active');
});

// Function to close the menu if clicking outside
document.addEventListener('click', (event) => {
    if (menu.classList.contains('active') && !menu.contains(event.target) && event.target !== humberg) {
        menu.classList.remove('active');
    }
});
//over humberg manu


// Fetch exchange rates from a public API
const apiKey = "YOUR_API_KEY"; // Replace with your free API key from https://exchangeratesapi.io/ or another service
const apiUrl = `https://api.exchangerate-api.com/v4/latest/`;

// DOM elements
const inputValue = document.querySelector('.input-value');
const outputValue = document.querySelector('.output-value');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');

// Fetch rates and calculate conversion
async function calculateResult() {
    const fromCurrencyValue = fromCurrency.value;
    const toCurrencyValue = toCurrency.value;

    if (!inputValue.value || isNaN(inputValue.value)) {
        outputValue.value = "Invalid input";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}${fromCurrencyValue}`);
        const data = await response.json();

        if (data.rates && data.rates[toCurrencyValue]) {
            const rate = data.rates[toCurrencyValue];
            const result = parseFloat(inputValue.value) * rate;
            outputValue.value = result.toFixed(2); // Round to 2 decimal places
        } else {
            outputValue.value = "Conversion failed";
        }
    } catch (error) {
        outputValue.value = "Error fetching data";
        console.error(error);
    }
}

// Append numbers and clear inputs
function appendValue(value) {
    inputValue.value += value;
}

function clearAll() {
    inputValue.value = '';
    outputValue.value = '';
}

function clearResult() {
    outputValue.value = '';
}

//for keyboard to display 
document.addEventListener("keydown", (event) => {
    const allowedkey = "0123456789+-*/().%";
    const resultBox = document.getElementsByClassName("result-box");

    if (allowedkey.includes(event.key)) {
        appendValue(event.key);
    } else if (event.key === "Enter") {
        calculateResult();
    } else if (event.key === "Backspace") {
        clearResult();
    } else if (event.key === "c") {
        clearAll();
    }
})
