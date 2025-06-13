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

//for keyboard to display 
document.addEventListener("keydown", (event) => {
    const allowedKeys = "0123456789+-*/().%";

    if (allowedKeys.includes(event.key)) {
        appendValue(event.key);
    } else if (event.key === "Enter") {
        calculateResult();
    } else if (event.key === "Backspace") {
        clearResult();
    } else if (event.key.toLowerCase() === "c") {
        clearAll();
    }
});

// Function to clear all inputs
function clearAll() {
    document.querySelector(".input-value").value = "";
    document.querySelector(".output-value").value = "";
    document.getElementById("from").value = "Select";
    document.getElementById("to").value = "Select";
}

// Function to clear the last input
function clearResult() {
    const inputBox = document.querySelector(".input-value");
    inputBox.value = inputBox.value.slice(0, -1);
}

// Function to append numbers to the input box
function appendValue(value) {
    const inputBox = document.querySelector(".input-value");
    inputBox.value += value;
}

//Main logic
const conversionRates = {
     "Electron volts(ev)_to_Joules": 1.60218e-19,
    "Joules_to_Electron volts(ev)": 1 / 1.60218e-19,
    "Joules_to_Kilojoules": 1e-3,
    "Kilojoules_to_Joules": 1e3,
    "Joules_to_Thermal calories": 0.239006,
    "Thermal calories_to_Joules": 1 / 0.239006,
    "Thermal calories_to_Food calories": 1 / 1000,
    "Food calories_to_Thermal calories": 1000,
    "Joules_to_Kilowatt-hours": 2.77778e-7,
    "Kilowatt-hours_to_Joules": 1 / 2.77778e-7,
    "Electron volts(ev)_to_Kilojoules": 1.60218e-22,
    "Kilojoules_to_Electron volts(ev)": 1 / 1.60218e-22,
    "Electron volts(ev)_to_Thermal calories": 3.8293e-20,
    "Thermal calories_to_Electron volts(ev)": 1 / 3.8293e-20,
    "Electron volts(ev)_to_Food calories": 3.8293e-23,
    "Food calories_to_Electron volts(ev)": 1 / 3.8293e-23,
    "Electron volts(ev)_to_Kilowatt-hours": 4.4505e-23,
    "Kilowatt-hours_to_Electron volts(ev)": 1 / 4.4505e-23,
    "Kilojoules_to_Thermal calories": 239.006,
    "Thermal calories_to_Kilojoules": 1 / 239.006,
    "Kilojoules_to_Food calories": 0.239006,
    "Food calories_to_Kilojoules": 1 / 0.239006,
    "Kilojoules_to_Kilowatt-hours": 2.77778e-4,
    "Kilowatt-hours_to_Kilojoules": 1 / 2.77778e-4,
    "Thermal calories_to_Kilowatt-hours": 2.77778e-7,
    "Kilowatt-hours_to_Thermal calories": 1 / 2.77778e-7,
    "Food calories_to_Kilowatt-hours": 2.77778e-4,
    "Kilowatt-hours_to_Food calories": 1 / 2.77778e-4,
    // Add more conversions as needed
};

// Function to convert energy
function calculateResult() {
    const fromUnit = document.getElementById("from").value;
    const toUnit = document.getElementById("to").value;
    const inputValue = parseFloat(document.querySelector(".input-value").value);

    // Validation
    if (isNaN(inputValue) || fromUnit === "Select" || toUnit === "Select") {
        alert("Please provide a valid input and select both units.");
        return;
    }

    let result;

    if (fromUnit === toUnit) {
        result = inputValue; // No conversion needed
    } else {
        const conversionKey = `${fromUnit}_to_${toUnit}`;
        const rate = conversionRates[conversionKey];

        if (rate === undefined) {
            alert("Conversion not supported.");
            return;
        }

        result = inputValue * rate;
    }

    // Display the result
    document.querySelector(".output-value").value = result.toPrecision(6); // Adjust precision if needed
}