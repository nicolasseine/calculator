/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable indent */
// Basic operation functions
const add = (a, b) => (a + b);
const substract = (a, b) => (a - b);
const multiply = (a, b) => (a * b);
const divide = (a, b) => (a / b);

// eslint-disable-next-line require-jsdoc
function operate(a, b, operator) {
    switch (operator) {
        case "plus":
            return add(a, b);
            break;
        case "minus":
            return substract(a, b);
            break;
        case "multiply":
            return multiply(a, b);
            break;
        case "divide":
            return divide(a, b);
            break;
    }
}


// Inputting numbers when pressing buttons
const numberButtons = document.getElementById("numbers-buttons-container");
const display = document.getElementById("display");
let displayedNumberArray = [];
let displayedNumber = 0;

function computeNumber(button) {
    displayedNumberArray.push(button.id);
    displayedNumber = displayedNumberArray.join("");
    display.textContent = displayedNumber;

}
numberButtons.addEventListener('click', e => {
    if (e.target.nodeName === "BUTTON") computeNumber(e.target);
});

// Clicking an operator
const operatorButtons = document.getElementById("operators-buttons-container");
let operator = '';
let a = 0;

function selectOperator(button) {
    operator = button.id;
    a = (a === 0) ? +displayedNumber : operate(a, displayedNumber, operator);
    display.textContent = a;
    displayedNumberArray = [];
}

operatorButtons.addEventListener('click', e => {
    if (e.target.nodeName === "BUTTON") selectOperator(e.target);
});
// clicking "equal"
const equalButton = document.getElementById("equal");

function pressequal() {
    a = operate(a, +displayedNumber, operator);
    display.textContent = a;
    displayedNumberArray = [];
}
equalButton.addEventListener('click', pressequal);