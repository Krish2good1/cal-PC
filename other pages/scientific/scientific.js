const humberg = document.querySelector('.humberg');
const menu = document.querySelector('.hamburger-menu');

humberg.addEventListener('click', (event) => {
    event.stopPropagation();
    menu.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (menu.classList.contains('active') && !menu.contains(event.target) && event.target !== humberg) {
        menu.classList.remove('active');
    }
});

menu.addEventListener('click', (event) => {
    event.stopPropagation();
});

const resultBox = document.querySelector('.result-box');
const historyBox = document.querySelector('.history-box');

let currentExpression = "";

// Factorial function reused from old code
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function appendValue(value) {
    if (value === 'x^2') {
        currentExpression += `**2`;
    } else if (value === '2√x') {
        currentExpression += `**(1/2)`;
    } else if (value === 'x^y') {
        currentExpression += '**';
    } else if (value === 'log') {
        currentExpression += 'Math.log10(';
    } else if (value === 'ln') {
        currentExpression += 'Math.log(';
    } else if (value === 'n!') {
        // Calculate factorial only if expression is a valid integer
        try {
            const val = eval(currentExpression);
            if (Number.isInteger(val) && val >= 0) {
                currentExpression = factorial(val).toString();
            } else {
                resultBox.value = "Error";
                setTimeout(() => updateResultBox(), 1500);
                return;
            }
        } catch {
            resultBox.value = "Error";
            setTimeout(() => updateResultBox(), 1500);
            return;
        }
    } else if (value === '10^x') {
        currentExpression += '10**';
    } else if (value === 'exp') {
        currentExpression += 'Math.exp(';
    } else if (value === '1/x') {
        currentExpression = `1/(${currentExpression})`;
    } else if (value === '|x|') {
        currentExpression = `Math.abs(${currentExpression})`;
    } else {
        currentExpression += value;
    }
    updateResultBox();
}

function appendParentheses() {
    // Add '(' if count is less or equal, else add ')'
    if ((currentExpression.match(/\(/g) || []).length <= (currentExpression.match(/\)/g) || []).length) {
        currentExpression += '(';
    } else {
        currentExpression += ')';
    }
    updateResultBox();
}

function clearAll() {
    currentExpression = "";
    updateResultBox();
}

function clearResult() {
    currentExpression = currentExpression.slice(0, -1);
    updateResultBox();
}

function toggleSign() {
    if (currentExpression) {
        if (currentExpression.startsWith('-')) {
            currentExpression = currentExpression.slice(1);
        } else {
            currentExpression = '-' + currentExpression;
        }
        updateResultBox();
    }
}

function calculateResult() {
    try {
        let sanitizedExpression = currentExpression
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        // Close any open parentheses for functions like log, ln, exp
        let openParens = (sanitizedExpression.match(/\(/g) || []).length;
        let closeParens = (sanitizedExpression.match(/\)/g) || []).length;
        sanitizedExpression += ')'.repeat(openParens - closeParens);

        const result = eval(sanitizedExpression);

        addToHistory(currentExpression, result);
        currentExpression = result.toString();
        updateResultBox();
    } catch (error) {
        resultBox.value = "Error";
        setTimeout(() => updateResultBox(), 1500);
    }
}

function updateResultBox() {
    resultBox.value = currentExpression || "0";
}

function addToHistory(expression, result) {
    // Create container div for each history item + separator
    const historyContainer = document.createElement('div');
    historyContainer.style.borderBottom = "1px solid #ccc";  // light gray line
    historyContainer.style.padding = "4px 0"; // some vertical spacing

    // Create the text element
    const historyItem = document.createElement('div');
    historyItem.textContent = `${expression} = ${result}`;

    // Append text inside container
    historyContainer.appendChild(historyItem);

    // Add container to history box at the top
    historyBox.prepend(historyContainer);

    updateHistoryMessage();
}


function updateHistoryMessage() {
    const noHistoryClass = 'no-history';
    const noHistoryElement = historyBox.querySelector(`.${noHistoryClass}`);
    const historyItems = Array.from(historyBox.children).filter(child => !child.matches('button'));

    if (historyItems.length === 0) {
        if (!noHistoryElement) {
            const noHistory = document.createElement('div');
            noHistory.classList.add(noHistoryClass);
            noHistory.textContent = "There is No History yet";
            historyBox.insertBefore(noHistory, historyBox.querySelector('button'));
        }
    } else if (noHistoryElement) {
        noHistoryElement.remove();
    }
}

function clearHistory() {
    const historyItems = Array.from(historyBox.children).filter(child => !child.matches('button'));
    historyItems.forEach(item => item.remove());
    updateHistoryMessage();
}

document.addEventListener("DOMContentLoaded", function () {
    const clearHistoryBtn = document.querySelector(".history-box button");
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", clearHistory);
    }
    updateHistoryMessage();

    // Setup history toggle for mobile (right side)
    const historyIcon = document.querySelector(".right-history-img");
    const rightHistoryBox = document.querySelector(".right");
    const mediaQuery = window.matchMedia("(max-width: 1000px)");

    function toggleHistoryBox() {
        if (mediaQuery.matches) {
            rightHistoryBox.classList.toggle("active");
        }
    }

    function closeHistoryBox(e) {
        if (mediaQuery.matches && rightHistoryBox.classList.contains("active")) {
            if (!rightHistoryBox.contains(e.target) && e.target !== historyIcon) {
                rightHistoryBox.classList.remove("active");
            }
        }
    }

    function handleResize() {
        if (mediaQuery.matches) {
            rightHistoryBox.classList.remove("active");
            historyIcon.style.display = "block";
        } else {
            rightHistoryBox.classList.remove("active");
            historyIcon.style.display = "none";
        }
    }

    historyIcon.addEventListener("click", toggleHistoryBox);
    document.addEventListener("click", closeHistoryBox);
    mediaQuery.addEventListener("change", handleResize);
    handleResize();
});

// Keyboard support for input and actions
document.addEventListener("keydown", (event) => {
    const allowedkey = "0123456789+-*/().%";
    if (allowedkey.includes(event.key)) {
        appendValue(event.key);
    } else if (event.key === "Enter") {
        calculateResult();
    } else if (event.key === "Backspace") {
        clearResult();
    } else if (event.key.toLowerCase() === "c") {
        clearAll();
    }
});

// Initialize calculator display
updateResultBox();
