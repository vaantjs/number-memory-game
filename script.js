// script.js

let level = 0;
let currentNumber = "";
let startTime;
let showingNumber = false;
let results = [];

// HTML-elementen
const startBtn = document.getElementById("startBtn");
const instruction = document.getElementById("instruction");
const game = document.getElementById("game");
const numberDisplay = document.getElementById("numberDisplay");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const levelDisplay = document.getElementById("level");
const resultsBtn = document.getElementById("resultsBtn");
const resultContent = document.getElementById("resultContent");
const resultsDiv = document.getElementById("results");

function generateRandomNumber(length) {
    let number = "";
    for (let i = 0; i < length; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

function startLevel() {
    level++;
    currentNumber = generateRandomNumber(level);
    levelDisplay.textContent = level;
    showNumber(currentNumber);
}

function showNumber(number) {
    showingNumber = true;
    numberDisplay.textContent = number;
    game.style.display = "none";
    
    setTimeout(() => {
        numberDisplay.textContent = "";
        game.style.display = "block";
        userInput.value = "";
        userInput.focus();
        showingNumber = false;
        startTime = new Date();
    }, 1500 + level * 500);
}

function checkInput() {
    if (showingNumber) return;

    const userAnswer = userInput.value;
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;

    if (userAnswer === currentNumber) {
        instruction.textContent = "Goed gedaan! Volgende level.";
        results.push({
            level: level,
            time: timeTaken,
            date: new Date().toLocaleString(),
        });
        saveResults();
        startLevel();
    } else {
        instruction.textContent = "Fout! Probeer opnieuw.";
        resetGame();
    }
}

function saveResults() {
    localStorage.setItem("numberMemoryResults", JSON.stringify(results));
}

function loadResults() {
    const savedResults = localStorage.getItem("numberMemoryResults");
    if (savedResults) {
        results = JSON.parse(savedResults);
    }
}

function displayResults() {
    resultContent.innerHTML = "";
    results.forEach((result, index) => {
        const resultItem = document.createElement("p");
        resultItem.textContent = `Speel ${index + 1}: Level ${result.level}, Tijd: ${result.time}s, Datum: ${result.date}`;
        resultContent.appendChild(resultItem);
    });
    resultsDiv.style.display = "block";
}

function resetGame() {
    level = 0;
    currentNumber = "";
    game.style.display = "none";
    startBtn.style.display = "block";
    instruction.textContent = "Klik op Start om opnieuw te beginnen.";
}

startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    instruction.textContent = "Onthoud het getal en voer het in!";
    startLevel();
});

submitBtn.addEventListener("click", checkInput);
userInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        checkInput();
    }
});

resultsBtn.addEventListener("click", displayResults);

loadResults();
